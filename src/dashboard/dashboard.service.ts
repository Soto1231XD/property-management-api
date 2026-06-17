import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary() {
    const [
      totalProperties,
      activeLeases,
      pendingPayments,
      paidPayments,
      expenses,
      services,
      maintenance,
    ] = await Promise.all([
      this.prisma.property.count(),

      this.prisma.lease.count({
        where: {
          status: 'Activo',
        },
      }),

      this.prisma.payment.count({
        where: {
          status: 'Pendiente',
        },
      }),

      this.prisma.payment.findMany({
        where: {
          status: 'Pagado',
        },
        select: {
          amount: true,
        },
      }),

      this.prisma.expense.findMany({
        select: {
          amount: true,
        },
      }),

      this.prisma.propertyService.findMany({
        select: {
          amount: true,
        },
      }),

      this.prisma.maintenance.findMany({
        select: {
          cost: true,
        },
      }),
    ]);

    const paidIncome = paidPayments.reduce(
      (total, payment) => total + payment.amount,
      0,
    );

    const totalExpenses = expenses.reduce(
      (total, expense) => total + expense.amount,
      0,
    );

    const totalServices = services.reduce(
      (total, service) => total + service.amount,
      0,
    );

    const totalMaintenance = maintenance.reduce(
      (total, item) => total + item.cost,
      0,
    );

    const totalOutcome = totalExpenses + totalServices + totalMaintenance;

    return {
      totalProperties,
      activeLeases,
      pendingPayments,
      paidIncome,
      totalExpenses,
      totalServices,
      totalMaintenance,
      totalOutcome,
      balance: paidIncome - totalOutcome,
    };
  }
}
