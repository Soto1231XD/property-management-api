import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreatePaymentDto) {
    return this.prisma.payment.create({
      data: {
        ...data,
        dueDate: new Date(data.dueDate),
        paymentDate: data.paymentDate ? new Date(data.paymentDate) : null,
      },
    });
  }

  findAll() {
    return this.prisma.payment.findMany({
      include: {
        property: true,
      },
      orderBy: {
        createdAt: 'desc',
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

  update(id: string, data: UpdatePaymentDto) {
    return this.prisma.payment.update({
      where: { id },
      data: {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        paymentDate: data.paymentDate ? new Date(data.paymentDate) : undefined,
      },
    });
  }

  remove(id: string) {
    return this.prisma.payment.delete({
      where: { id },
    });
  }
}
