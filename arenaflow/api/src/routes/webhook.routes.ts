import { Router } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

router.post('/abacate-pay', async (req, res) => {
  try {
    const { event, data } = req.body;

    console.log(`🔔 Evento recebido: ${event}`);

    // Evento de pagamento confirmado
    if (event === 'billing.paid') {
      const customerId = data.customer?.id || data.customerId;
      const amount = data.amount;
      
      if (!customerId) {
        throw new Error("CustomerId não encontrado no payload do webhook");
      }

      // 1. Identificar o plano pelo valor (em centavos)
      const planName = amount === 14990 ? "PRO" : "ELITE";

      console.log(`✅ Pagamento de R$${amount/100} confirmado para Customer: ${customerId}`);

      // 2. Atualizar o Tenant no Banco (Agora funciona pois o campo é @unique)
      const updatedTenant = await prisma.tenant.update({
        where: { customerId: customerId },
        data: {
          status: 'ACTIVE',
          plan: planName,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 dias
        }
      });

      console.log(`🚀 Arena ${updatedTenant.slug} agora é ${planName} e está ATIVA!`);
      return res.status(200).json({ success: true });
    }

    // Tratar expiração ou estorno
    if (event === 'billing.expired' || event === 'billing.refunded') {
      const customerId = data.customer?.id || data.customerId;
      
      if (customerId) {
        await prisma.tenant.update({
          where: { customerId: customerId },
          data: { status: 'INACTIVE' }
        });
        console.log(`⚠️ Assinatura do customer ${customerId} marcada como INATIVA.`);
      }
    }

    return res.status(200).json({ message: "Evento processado" });
  } catch (error: any) {
    console.error("❌ Erro no Webhook:", error.message);
    // Respondemos 200 ou 400 para o Abacate não ficar tentando reenviar infinitamente se for erro de lógica
    return res.status(400).json({ error: error.message });
  }
});

export const webHooksRoutes = router;