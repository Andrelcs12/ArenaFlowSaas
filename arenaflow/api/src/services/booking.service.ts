import { prisma } from "../lib/prisma";


export class BookingService {
  static async create(data: any) {
    // Validação básica de choque de horário
    const conflict = await prisma.booking.findFirst({
      where: {
        courtId: data.courtId,
        status: "CONFIRMED",
        NOT: { status: "CANCELLED" },
        startTime: { lt: new Date(data.endTime) },
        endTime: { gt: new Date(data.startTime) },
      }
    });

    if (conflict) throw new Error("Horário já ocupado!");

    return prisma.booking.create({ data });
  }

  static async getByTenant(tenantId: string) {
    return prisma.booking.findMany({
      where: { tenantId },
      include: { court: true, user: true },
      orderBy: { startTime: 'asc' }
    });
  }

  static async updateStatus(id: string, status: string) {
    return prisma.booking.update({ where: { id }, data: { status } });
  }
}