import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ServicesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(data: CreateServiceDto) {
    const service = await this.prisma.propertyService.create({
      data: {
        ...data,
        dueDate: new Date(data.dueDate),
        paymentDate: data.paymentDate ? new Date(data.paymentDate) : null,
      },
    });

    await this.notificationsService.sendEmailAlerts();

    return service;
  }

  findAll() {
    return this.prisma.propertyService.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        property: true,
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

  async update(id: string, data: UpdateServiceDto) {
    const service = await this.prisma.propertyService.update({
      where: { id },
      data: {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        paymentDate: data.paymentDate ? new Date(data.paymentDate) : undefined,
      },
    });

    await this.notificationsService.sendEmailAlerts();

    return service;
  }

  remove(id: string) {
    return this.prisma.propertyService.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
