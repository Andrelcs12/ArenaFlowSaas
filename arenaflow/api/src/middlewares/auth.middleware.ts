export const checkSubscription = async (req: any, res: any, next: any) => {
  const { tenantId } = req.user;

  const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });

  if (!tenant || tenant.status === "INACTIVE" || tenant.status === "PAST_DUE") {
    return res.status(403).json({ 
      error: "Pagamento pendente", 
      message: "Sua assinatura expirou. Regularize com a Novely para continuar usando o ArenaFlow." 
    });
  }

  next();
};