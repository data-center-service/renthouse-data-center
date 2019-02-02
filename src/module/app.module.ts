import { Module } from '@nestjs/common';
import { ControllerModule } from './controller.module';
import { ConfigModule } from '../provider/config/config.module';

@Module({
  imports: [ControllerModule, ConfigModule],
})
export class AppModule { }
