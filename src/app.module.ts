import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './shared/shared.module'; 
import { CoreModule } from './core/core.module';
import { ExpenseModule } from './expense/expense.module';
import { ErrorsModule } from './errors/errors.module';

@Module({
  imports: [SharedModule, CoreModule, ExpenseModule, ErrorsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
