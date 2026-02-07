import { prisma } from "../lib/prisma";

export class CourtService {
  static async create(data: { name: string; pricePerHour: number; tenantId: string }) {
    return prisma.court.create({ data });
  }

  static async getByTenant(tenantId: string) {
    return prisma.court.findMany({ where: { tenantId } });
  }
}