import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';

import { PropertiesService } from './properties.service';
import { PropertiesController } from './properties.controller';

@Module({
  imports: [PrismaModule],
  providers: [PropertiesService],
  controllers: [PropertiesController],
})
export class PropertiesModule {}
