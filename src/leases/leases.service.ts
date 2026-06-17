import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateLeaseDto } from './dto/create-lease.dto';
import { UpdateLeaseDto } from './dto/update-lease.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class LeasesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(data: CreateLeaseDto) {
    const lease = await this.prisma.lease.create({
      data: {
        ...data,
        contractStartDate: new Date(data.contractStartDate),
        contractEndDate: new Date(data.contractEndDate),
      },
    });

    await this.notificationsService.sendEmailAlerts();

    return lease;
  }

  findAll() {
    return this.prisma.lease.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        property: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.lease.findUnique({
      where: { id },
      include: {
        property: true,
      },
    });
  }

  async update(id: string, data: UpdateLeaseDto) {
    const lease = await this.prisma.lease.update({
      where: { id },
      data: {
        ...data,
        contractStartDate: data.contractStartDate
          ? new Date(data.contractStartDate)
          : undefined,
        contractEndDate: data.contractEndDate
          ? new Date(data.contractEndDate)
          : undefined,
      },
    });

    await this.notificationsService.sendEmailAlerts();

    return lease;
  }

  remove(id: string) {
    return this.prisma.lease.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
