import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

type TrashModule =
  | 'properties'
  | 'leases'
  | 'payments'
  | 'expenses'
  | 'services'
  | 'maintenance'
  | 'promissory-notes';

@Injectable()
export class TrashService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const [
      properties,
      leases,
      payments,
      expenses,
      services,
      maintenance,
      promissoryNotes,
    ] = await Promise.all([
      this.prisma.property.findMany({
        where: { deletedAt: { not: null } },
        select: {
          id: true,
          name: true,
          deletedAt: true,
        },
      }),

      this.prisma.lease.findMany({
        where: { deletedAt: { not: null } },
        select: {
          id: true,
          tenantName: true,
          deletedAt: true,
          property: {
            select: {
              name: true,
            },
          },
        },
      }),

      this.prisma.payment.findMany({
        where: { deletedAt: { not: null } },
        select: {
          id: true,
          month: true,
          amount: true,
          deletedAt: true,
          property: {
            select: {
              name: true,
            },
          },
        },
      }),

      this.prisma.expense.findMany({
        where: { deletedAt: { not: null } },
        select: {
          id: true,
          concept: true,
          amount: true,
          deletedAt: true,
          property: {
            select: {
              name: true,
            },
          },
        },
      }),

      this.prisma.propertyService.findMany({
        where: { deletedAt: { not: null } },
        select: {
          id: true,
          type: true,
          amount: true,
          deletedAt: true,
          property: {
            select: {
              name: true,
            },
          },
        },
      }),

      this.prisma.maintenance.findMany({
        where: { deletedAt: { not: null } },
        select: {
          id: true,
          description: true,
          cost: true,
          deletedAt: true,
          property: {
            select: {
              name: true,
            },
          },
        },
      }),

      this.prisma.promissoryNote.findMany({
        where: { deletedAt: { not: null } },
        select: {
          id: true,
          noteNumber: true,
          amount: true,
          deletedAt: true,
          property: {
            select: {
              name: true,
            },
          },
        },
      }),
    ]);

    return [
      ...properties.map((item) => ({
        id: item.id,
        module: 'properties',
        title: item.name,
        description: 'Propiedad eliminada',
        deletedAt: item.deletedAt,
      })),

      ...leases.map((item) => ({
        id: item.id,
        module: 'leases',
        title: item.property.name,
        description: `Arrendamiento de ${item.tenantName}`,
        deletedAt: item.deletedAt,
      })),

      ...payments.map((item) => ({
        id: item.id,
        module: 'payments',
        title: item.property.name,
        description: `Pago de ${item.month} - $${item.amount}`,
        deletedAt: item.deletedAt,
      })),

      ...expenses.map((item) => ({
        id: item.id,
        module: 'expenses',
        title: item.property.name,
        description: `${item.concept} - $${item.amount}`,
        deletedAt: item.deletedAt,
      })),

      ...services.map((item) => ({
        id: item.id,
        module: 'services',
        title: item.property.name,
        description: `${item.type} - $${item.amount}`,
        deletedAt: item.deletedAt,
      })),

      ...maintenance.map((item) => ({
        id: item.id,
        module: 'maintenance',
        title: item.property.name,
        description: `${item.description} - $${item.cost}`,
        deletedAt: item.deletedAt,
      })),

      ...promissoryNotes.map((item) => ({
        id: item.id,
        module: 'promissory-notes',
        title: item.property.name,
        description: `Pagaré ${item.noteNumber} - $${item.amount}`,
        deletedAt: item.deletedAt,
      })),
    ].sort((a, b) => {
      return (
        new Date(b.deletedAt ?? '').getTime() -
        new Date(a.deletedAt ?? '').getTime()
      );
    });
  }

  restore(module: TrashModule, id: string) {
    const data = {
      deletedAt: null,
    };

    if (module === 'properties') {
      return this.prisma.property.update({ where: { id }, data });
    }

    if (module === 'leases') {
      return this.prisma.lease.update({ where: { id }, data });
    }

    if (module === 'payments') {
      return this.prisma.payment.update({ where: { id }, data });
    }

    if (module === 'expenses') {
      return this.prisma.expense.update({ where: { id }, data });
    }

    if (module === 'services') {
      return this.prisma.propertyService.update({ where: { id }, data });
    }

    if (module === 'maintenance') {
      return this.prisma.maintenance.update({ where: { id }, data });
    }

    if (module === 'promissory-notes') {
      return this.prisma.promissoryNote.update({ where: { id }, data });
    }

    throw new BadRequestException('Módulo no válido');
  }
}
