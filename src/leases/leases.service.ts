import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateLeaseDto } from './dto/create-lease.dto';
import { UpdateLeaseDto } from './dto/update-lease.dto';

@Injectable()
export class LeasesService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateLeaseDto) {
    return this.prisma.lease.create({
      data: {
        ...data,
        contractStartDate: new Date(data.contractStartDate),
        contractEndDate: new Date(data.contractEndDate),
      },
    });
  }

  findAll() {
    return this.prisma.lease.findMany({
      include: {
        property: true,
      },
      orderBy: {
        createdAt: 'desc',
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

  update(id: string, data: UpdateLeaseDto) {
    return this.prisma.lease.update({
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
  }

  remove(id: string) {
    return this.prisma.lease.delete({
      where: { id },
    });
  }
}
