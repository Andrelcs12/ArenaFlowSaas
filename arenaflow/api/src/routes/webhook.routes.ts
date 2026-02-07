import { prisma } from "../lib/prisma";
import router from "./payment.routes";

router.post('/abacate', async (req, res) => {
  const event = req.body; // O Abacate Pay envia os dados aqui

  // Verificamos se o evento é de pagamento confirmado
  if (event.event === 'billing.paid') {
    const customerId = event.data.customer.id;
    const subscriptionId = event.data.id;

    // Atualizamos o Tenant no banco de dados
    await prisma.tenant.updateMany({
      where: { customerId: customerId },
      data: {
        status: 'ACTIVE',
        subscriptionId: subscriptionId,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // +30 dias
      }
    });
  }

  res.sendStatus(200); // Avisa pro Abacate que você recebeu
});