import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { LeasesController } from './leases.controller';
import { LeasesService } from './leases.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [PrismaModule, NotificationsModule],
  controllers: [LeasesController],
  providers: [LeasesService],
})
export class LeasesModule {}
