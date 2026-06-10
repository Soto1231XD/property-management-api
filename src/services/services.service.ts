import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateServiceDto) {
    return this.prisma.propertyService.create({
      data: {
        ...data,
        dueDate: new Date(data.dueDate),
        paymentDate: data.paymentDate ? new Date(data.paymentDate) : null,
      },
    });
  }

  findAll() {
    return this.prisma.propertyService.findMany({
      include: {
        property: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  findOne(id: string) {
    return this.prisma.propertyService.findUnique({
      where: { id },
      include: {
        property: true,
      },
    });
  }

  update(id: string, data: UpdateServiceDto) {
    return this.prisma.propertyService.update({
      where: { id },
      data: {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        paymentDate: data.paymentDate ? new Date(data.paymentDate) : undefined,
      },
    });
  }

  remove(id: string) {
    return this.prisma.propertyService.delete({
      where: { id },
    });
  }
}
