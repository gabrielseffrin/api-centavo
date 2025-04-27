import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './shared/shared.module'; // o que faz o SharedModule?
import { CoreModule } from './core/core.module';

@Module({
  imports: [SharedModule, CoreModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}