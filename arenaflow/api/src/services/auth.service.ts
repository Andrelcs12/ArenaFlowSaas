import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export class AuthService {
  static async register(data: any) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    // Na criação, já retornamos o usuário com o tenant para garantir consistência
    return prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        role: data.role || "USER",
        tenantId: data.tenantId, 
      },
      include: {
        tenant: true // Inclui os dados da arena recém-criada
      }
    });
  }

  static async login({ email, password }: any) {
    // CORREÇÃO AQUI: Adicionado o 'include' para buscar os dados da Arena/Tenant
    const user = await prisma.user.findUnique({ 
      where: { email },
      include: {
        tenant: true // Essencial para o Front-end saber o 'slug' da URL
      }
    });

    if (!user) throw new Error("Credenciais inválidas");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error("Credenciais inválidas");

    // Geramos o token com o tenantId no payload para segurança nas rotas
    const token = jwt.sign(
      { userId: user.id, role: user.role, tenantId: user.tenantId },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Retornamos o objeto completo que o seu AuthContext espera
    return { 
      user: { 
        id: user.id, 
        email: user.email, 
        role: user.role,
        tenantId: user.tenantId,
        tenant: user.tenant // Agora o front recebe: user.tenant.slug
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