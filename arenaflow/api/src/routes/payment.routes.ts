import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { PaymentService } from '../services/payments.service';

const router = Router();

router.post('/create-checkout', async (req: any, res) => {
  const { planId } = req.body; // 'FREE' | 'PRO' | 'GOLD'
  const { tenantId } = req.user; // Vem do token do dono da arena

  const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });

  // Define o preço baseado no plano selecionado
  const price = planId === 'PRO' ? 14990 : 29990; // Em centavos

  try {
    const session = await PaymentService.createSubscription({
      ...tenant,
      price,
      planId
    });

    // O Abacate Pay retorna um campo 'url' ou 'checkoutUrl'
    res.json({ url: session.data.url }); 
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar checkout" });
  }
});

export default router;