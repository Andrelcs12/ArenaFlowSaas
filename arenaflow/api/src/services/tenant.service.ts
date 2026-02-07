import { prisma } from "../lib/prisma";

export class TenantService {
  static async create(data: { name: string; slug: string; colors?: any }) {
    // Adicionamos um check básico para evitar slugs duplicados antes de tentar o banco
    const existing = await prisma.tenant.findUnique({ where: { slug: data.slug } });
    if (existing) throw new Error("Esta URL (slug) já está em uso.");

    return prisma.tenant.create({ 
      data: {
        name: data.name,
        slug: data.slug,
        colors: data.colors || {} // Garante que não vá nulo
      } 
    });
  }

  static async getAll() {
    return prisma.tenant.findMany({ 
      include: { 
        _count: { 
          select: { courts: true } 
        } 
      } 
    });
  }

  static async getBySlug(slug: string) {
    return prisma.tenant.findUnique({
      where: { slug },
      include: { courts: true }
    });
  }
}