import { Module } from '@nestjs/common';
import { ServiceModule } from './service.module';

@Module({
  imports: [ServiceModule],
  controllers: [],
})
export class ControllerModule { }
