import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreatePromissoryNoteDto } from './dto/create-promissory-note.dto';
import { UpdatePromissoryNoteDto } from './dto/update-promissory-note.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class PromissoryNotesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(data: CreatePromissoryNoteDto) {
    const note = await this.prisma.promissoryNote.create({
      data: {
        ...data,
        issueDate: new Date(data.issueDate),
        dueDate: new Date(data.dueDate),
        paymentDate: data.paymentDate ? new Date(data.paymentDate) : null,
      },
    });

    await this.notificationsService.sendEmailAlerts();

    return note;
  }

  findAll() {
    return this.prisma.promissoryNote.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        property: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.promissoryNote.findUnique({
      where: { id },
      include: {
        property: true,
      },
    });
  }

  async update(id: string, data: UpdatePromissoryNoteDto) {
    const note = await this.prisma.promissoryNote.update({
      where: { id },
      data: {
        ...data,
        issueDate: data.issueDate ? new Date(data.issueDate) : undefined,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        paymentDate: data.paymentDate ? new Date(data.paymentDate) : undefined,
      },
    });

    await this.notificationsService.sendEmailAlerts();

    return note;
  }

  remove(id: string) {
    return this.prisma.promissoryNote.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
