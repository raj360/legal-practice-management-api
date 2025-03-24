import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CasesModule } from './cases/cases.module';
import { DocumentsModule } from './documents/documents.module';
import { TimeEntriesModule } from './time-entries/time-entries.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    CasesModule,
    DocumentsModule,
    TimeEntriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
