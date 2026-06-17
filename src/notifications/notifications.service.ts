import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';

type NotificationPriority = 'LOW' | 'MEDIUM' | 'HIGH';

type NotificationItem = {
  id: string;
  type: string;
  title: string;
  description: string;
  date: Date;
  priority: NotificationPriority;
  module: string;
  recordId: string;
};

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  private getPriorityByDate(
    date: Date,
    today: Date,
    nextFourteenDays: Date,
    nextThirtyDays: Date,
  ): NotificationPriority | null {
    if (date < today) return 'HIGH';
    if (date <= nextFourteenDays) return 'MEDIUM';
    if (date <= nextThirtyDays) return 'LOW';

    return null;
  }

  private getPriorityLabel(priority: NotificationPriority) {
    if (priority === 'HIGH') return 'Urgente';
    if (priority === 'MEDIUM') return 'Atención';
    return 'Recordatorio';
  }

  async findAll() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const nextFourteenDays = new Date(today);
    nextFourteenDays.setDate(today.getDate() + 14);

    const nextThirtyDays = new Date(today);
    nextThirtyDays.setDate(today.getDate() + 30);

    const [payments, services, leases, maintenances, promissoryNotes] =
      await Promise.all([
        this.prisma.payment.findMany({
          where: {
            deletedAt: null,
            status: {
              notIn: ['Pagado', 'Cancelado'],
            },
          },
          include: {
            property: true,
          },
        }),

        this.prisma.propertyService.findMany({
          where: {
            deletedAt: null,
            status: {
              notIn: ['Pagado', 'Cancelado'],
            },
          },
          include: {
            property: true,
          },
        }),

        this.prisma.lease.findMany({
          where: {
            deletedAt: null,
            status: {
              notIn: ['Finalizado', 'Cancelado'],
            },
          },
          include: {
            property: true,
          },
        }),

        this.prisma.maintenance.findMany({
          where: {
            deletedAt: null,
            status: {
              notIn: ['Realizado', 'Cancelado'],
            },
          },
          include: {
            property: true,
          },
        }),

        this.prisma.promissoryNote.findMany({
          where: {
            deletedAt: null,
            status: {
              notIn: ['Pagado', 'Cancelado'],
            },
          },
          include: {
            property: true,
          },
        }),
      ]);

    const notifications: NotificationItem[] = [];

    for (const payment of payments) {
      const dueDate = new Date(payment.dueDate);
      dueDate.setHours(0, 0, 0, 0);

      const priority = this.getPriorityByDate(
        dueDate,
        today,
        nextFourteenDays,
        nextThirtyDays,
      );

      if (!priority) continue;

      const isOverdue = priority === 'HIGH';

      notifications.push({
        id: `payment-${isOverdue ? 'overdue' : priority.toLowerCase()}-${
          payment.id
        }`,
        type: isOverdue ? 'PAYMENT_OVERDUE' : 'PAYMENT_UPCOMING',
        title: isOverdue ? 'Pago vencido' : 'Pago próximo a vencer',
        description: isOverdue
          ? `El pago de ${payment.property.name} del mes ${payment.month} está vencido.`
          : `El pago de ${payment.property.name} del mes ${payment.month} vence ${
              priority === 'MEDIUM'
                ? 'en 2 semanas o menos'
                : 'en 1 mes o menos'
            }.`,
        date: dueDate,
        priority,
        module: 'payments',
        recordId: payment.id,
      });
    }

    for (const service of services) {
      const dueDate = new Date(service.dueDate);
      dueDate.setHours(0, 0, 0, 0);

      const priority = this.getPriorityByDate(
        dueDate,
        today,
        nextFourteenDays,
        nextThirtyDays,
      );

      if (!priority) continue;

      const isOverdue = priority === 'HIGH';

      notifications.push({
        id: `service-${isOverdue ? 'overdue' : priority.toLowerCase()}-${
          service.id
        }`,
        type: isOverdue ? 'SERVICE_OVERDUE' : 'SERVICE_UPCOMING',
        title: isOverdue ? 'Servicio vencido' : 'Servicio próximo a vencer',
        description: isOverdue
          ? `El servicio ${service.type} de ${service.property.name} está vencido.`
          : `El servicio ${service.type} de ${service.property.name} vence ${
              priority === 'MEDIUM'
                ? 'en 2 semanas o menos'
                : 'en 1 mes o menos'
            }.`,
        date: dueDate,
        priority,
        module: 'services',
        recordId: service.id,
      });
    }

    for (const lease of leases) {
      const endDate = new Date(lease.contractEndDate);
      endDate.setHours(0, 0, 0, 0);

      const priority = this.getPriorityByDate(
        endDate,
        today,
        nextFourteenDays,
        nextThirtyDays,
      );

      if (!priority) continue;

      const isOverdue = priority === 'HIGH';

      notifications.push({
        id: `lease-${isOverdue ? 'overdue' : priority.toLowerCase()}-${
          lease.id
        }`,
        type: isOverdue ? 'LEASE_OVERDUE' : 'LEASE_ENDING',
        title: isOverdue ? 'Contrato vencido' : 'Contrato próximo a vencer',
        description: isOverdue
          ? `El contrato de ${lease.property.name} ya venció.`
          : `El contrato de ${lease.property.name} termina ${
              priority === 'MEDIUM'
                ? 'en 2 semanas o menos'
                : 'en 1 mes o menos'
            }.`,
        date: endDate,
        priority,
        module: 'leases',
        recordId: lease.id,
      });
    }

    for (const maintenance of maintenances) {
      if (!maintenance.nextServiceDate) continue;

      const nextServiceDate = new Date(maintenance.nextServiceDate);
      nextServiceDate.setHours(0, 0, 0, 0);

      const priority = this.getPriorityByDate(
        nextServiceDate,
        today,
        nextFourteenDays,
        nextThirtyDays,
      );

      if (!priority) continue;

      const isOverdue = priority === 'HIGH';

      notifications.push({
        id: `maintenance-${isOverdue ? 'overdue' : priority.toLowerCase()}-${
          maintenance.id
        }`,
        type: isOverdue ? 'MAINTENANCE_OVERDUE' : 'MAINTENANCE_UPCOMING',
        title: isOverdue ? 'Mantenimiento vencido' : 'Mantenimiento próximo',
        description: isOverdue
          ? `El mantenimiento de ${maintenance.property.name} ya venció.`
          : `El mantenimiento de ${maintenance.property.name} está programado ${
              priority === 'MEDIUM'
                ? 'en 2 semanas o menos'
                : 'en 1 mes o menos'
            }.`,
        date: nextServiceDate,
        priority,
        module: 'maintenance',
        recordId: maintenance.id,
      });
    }

    for (const note of promissoryNotes) {
      const dueDate = new Date(note.dueDate);
      dueDate.setHours(0, 0, 0, 0);

      const priority = this.getPriorityByDate(
        dueDate,
        today,
        nextFourteenDays,
        nextThirtyDays,
      );

      if (!priority) continue;

      const isOverdue = priority === 'HIGH';

      notifications.push({
        id: `note-${isOverdue ? 'overdue' : priority.toLowerCase()}-${note.id}`,
        type: isOverdue
          ? 'PROMISSORY_NOTE_OVERDUE'
          : 'PROMISSORY_NOTE_UPCOMING',
        title: isOverdue ? 'Pagaré vencido' : 'Pagaré próximo a vencer',
        description: isOverdue
          ? `El pagaré ${note.noteNumber} de ${note.property.name} está vencido.`
          : `El pagaré ${note.noteNumber} de ${note.property.name} vence ${
              priority === 'MEDIUM'
                ? 'en 2 semanas o menos'
                : 'en 1 mes o menos'
            }.`,
        date: dueDate,
        priority,
        module: 'promissory-notes',
        recordId: note.id,
      });
    }

    const readNotifications = await this.prisma.notificationRead.findMany({
      select: {
        notificationId: true,
      },
    });

    const readIds = new Set(
      readNotifications.map((item) => item.notificationId),
    );

    return notifications
      .filter((item) => !readIds.has(item.id))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  async markAsRead(notificationId: string) {
    return this.prisma.notificationRead.upsert({
      where: {
        notificationId,
      },
      update: {
        readAt: new Date(),
      },
      create: {
        notificationId,
      },
    });
  }

  async countUnread() {
    const notifications = await this.findAll();

    return {
      count: notifications.length,
    };
  }

  async sendEmailAlerts() {
    const notifications = await this.findAll();

    let sent = 0;

    for (const notification of notifications) {
      const alreadySent = await this.prisma.notificationEmailLog.findUnique({
        where: {
          notificationId: notification.id,
        },
      });

      if (alreadySent) continue;

      await this.mailService.sendNotificationEmail({
        subject: `${notification.title} - TAMIVAR`,
        html: `
          <h2>${notification.title}</h2>
          <p>${notification.description}</p>
          <p><strong>Prioridad:</strong> ${this.getPriorityLabel(
            notification.priority,
          )}</p>
          <p><strong>Fecha:</strong> ${new Date(
            notification.date,
          ).toLocaleDateString('es-MX')}</p>
        `,
      });

      await this.prisma.notificationEmailLog.create({
        data: {
          notificationId: notification.id,
        },
      });

      sent++;
    }

    return {
      sent,
      message: `Correos enviados: ${sent}`,
    };
  }
}
