import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { PaymentService } from '../services/payments.service';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post('/create-checkout', authMiddleware, async (req: any, res) => {
  try {
    const { tenantId } = req.user;
    const { planId } = req.body;

    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) return res.status(404).json({ error: "Arena não encontrada." });

    const price = planId === 'PRO' ? 14990 : 29990;

    // Função auxiliar para criar cliente e salvar no banco
    const createNewCustomer = async () => {
      const customer = await PaymentService.createCustomer(tenant);
      await prisma.tenant.update({
        where: { id: tenantId },
        data: { customerId: customer.id }
      });
      return customer.id;
    };

    let abacateId = tenant.customerId;

    // Passo 1: Se não tem ID, cria um
    if (!abacateId) {
      abacateId = await createNewCustomer();
    }

    // Passo 2: Tenta criar a cobrança
    let session = await PaymentService.createSubscription(abacateId!, price, tenant.slug);

    // Passo 3: Se o Abacate reclamar que o cliente não existe (ID fantasma no banco)
    if (session.error && session.error.toLowerCase().includes("not found")) {
      console.log("⚠️ ID fantasma detectado. Criando novo cliente...");
      abacateId = await createNewCustomer();
      session = await PaymentService.createSubscription(abacateId!, price, tenant.slug);
    }

    if (session.data?.url) {
      return res.json({ url: session.data.url });
    }

    throw new Error(session.error || "Falha ao gerar link");

  } catch (error: any) {
    console.error("❌ ERRO NO CHECKOUT:", error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;