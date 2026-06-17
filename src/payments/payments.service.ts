import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(data: CreatePaymentDto) {
    const payment = await this.prisma.payment.create({
      data: {
        ...data,
        dueDate: new Date(data.dueDate),
        paymentDate: data.paymentDate ? new Date(data.paymentDate) : null,
      },
    });

    await this.notificationsService.sendEmailAlerts();

    return payment;
  }

  findAll() {
    return this.prisma.payment.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        property: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.payment.findUnique({
      where: { id },
      include: {
        property: true,
      },
    });
  }

  async update(id: string, data: UpdatePaymentDto) {
    const payment = await this.prisma.payment.update({
      where: { id },
      data: {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        paymentDate: data.paymentDate ? new Date(data.paymentDate) : null,
      },
    });

    await this.notificationsService.sendEmailAlerts();

    return payment;
  }

  remove(id: string) {
    return this.prisma.payment.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
