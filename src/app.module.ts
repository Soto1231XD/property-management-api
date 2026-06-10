import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PropertiesModule } from './properties/properties.module';
import { LeasesModule } from './leases/leases.module';
import { PaymentsModule } from './payments/payments.module';
import { ExpensesModule } from './expenses/expenses.module';
import { ServicesModule } from './services/services.module';
import { MaintenanceModule } from './maintenance/maintenance.module';
import { PromissoryNotesModule } from './promissory-notes/promissory-notes.module';
import { ReportsModule } from './reports/reports.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    PropertiesModule,
    LeasesModule,
    PaymentsModule,
    ExpensesModule,
    ServicesModule,
    MaintenanceModule,
    PromissoryNotesModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
