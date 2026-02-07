import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export class AuthService {
  static async register(data: any) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    // Criamos o Tenant e o User em uma única transação
    return prisma.$transaction(async (tx) => {
      // 1. Criar o Tenant (Arena)
      const tenant = await tx.tenant.create({
        data: {
          name: data.name,
          slug: data.slug,
          status: "TRIAL", // Inicia em teste
          plan: "FREE",
          // Geramos um customerId temporário para você testar no Insomnia
          customerId: `cust_${Math.random().toString(36).substr(2, 9)}`
        }
      });

      // 2. Criar o Usuário vinculado a essa Arena
      const user = await tx.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          role: "ADMIN", // Primeiro usuário é sempre ADMIN
          tenantId: tenant.id,
        },
        include: {
          tenant: true
        }
      });

      return user;
    });
  }

  static async login({ email, password }: any) {
    const user = await prisma.user.findUnique({ 
      where: { email },
      include: { tenant: true }
    });

    if (!user) throw new Error("Credenciais inválidas");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error("Credenciais inválidas");

    const token = jwt.sign(
      { userId: user.id, role: user.role, tenantId: user.tenantId },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return { 
      user: { 
        id: user.id, 
        email: user.email, 
        role: user.role,
        tenantId: user.tenantId,
        tenant: user.tenant 
      }, 
      token 
    };
  }

  static async verifyToken(token: string) {
    try {
      return jwt.verify(token, JWT_SECRET) as any;
    } catch (error) {
      return null;
    }
  }
}