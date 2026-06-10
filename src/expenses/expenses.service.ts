import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Injectable()
export class ExpensesService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateExpenseDto) {
    return this.prisma.expense.create({
      data: {
        ...data,
        date: new Date(data.date),
        paymentDueDate: data.paymentDueDate
          ? new Date(data.paymentDueDate)
          : null,
        paymentDate: data.paymentDate ? new Date(data.paymentDate) : null,
      },
    });
  }

  findAll() {
    return this.prisma.expense.findMany({
      include: {
        property: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  findOne(id: string) {
    return this.prisma.expense.findUnique({
      where: { id },
      include: {
        property: true,
      },
    });
  }

  update(id: string, data: UpdateExpenseDto) {
    return this.prisma.expense.update({
      where: { id },
      data: {
        ...data,
        date: data.date ? new Date(data.date) : undefined,
        paymentDueDate: data.paymentDueDate
          ? new Date(data.paymentDueDate)
          : undefined,
        paymentDate: data.paymentDate ? new Date(data.paymentDate) : undefined,
      },
    });
  }

  remove(id: string) {
    return this.prisma.expense.delete({
      where: { id },
    });
  }
}
