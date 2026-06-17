import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class MaintenanceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(data: CreateMaintenanceDto) {
    const maintenance = await this.prisma.maintenance.create({
      data: {
        ...data,
        startDate: new Date(data.startDate),
        nextServiceDate: data.nextServiceDate
          ? new Date(data.nextServiceDate)
          : null,
      },
    });

    await this.notificationsService.sendEmailAlerts();
    return maintenance;
  }

  findAll() {
    return this.prisma.maintenance.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        property: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.maintenance.findUnique({
      where: { id },
      include: {
        property: true,
      },
    });
  }

  async update(id: string, data: UpdateMaintenanceDto) {
    const maintenance = await this.prisma.maintenance.update({
      where: { id },
      data: {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        nextServiceDate: data.nextServiceDate
          ? new Date(data.nextServiceDate)
          : undefined,
      },
    });
    await this.notificationsService.sendEmailAlerts();
    return maintenance;
  }

  remove(id: string) {
    return this.prisma.maintenance.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
