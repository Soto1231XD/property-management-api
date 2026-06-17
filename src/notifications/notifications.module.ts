import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { MailModule } from '../mail/mail.module';

import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService],
  imports: [PrismaModule, MailModule],
  exports: [NotificationsService],
})
export class NotificationsModule {}
