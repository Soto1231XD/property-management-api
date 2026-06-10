import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';

@Injectable()
export class MaintenanceService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateMaintenanceDto) {
    return this.prisma.maintenance.create({
      data: {
        ...data,
        startDate: new Date(data.startDate),
        nextServiceDate: data.nextServiceDate
          ? new Date(data.nextServiceDate)
          : null,
      },
    });
  }

  findAll() {
    return this.prisma.maintenance.findMany({
      include: {
        property: true,
      },
      orderBy: {
        createdAt: 'desc',
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

  update(id: string, data: UpdateMaintenanceDto) {
    return this.prisma.maintenance.update({
      where: { id },
      data: {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        nextServiceDate: data.nextServiceDate
          ? new Date(data.nextServiceDate)
          : undefined,
      },
    });
  }

  remove(id: string) {
    return this.prisma.maintenance.delete({
      where: { id },
    });
  }
}
