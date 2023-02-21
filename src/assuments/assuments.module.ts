import { Module } from '@nestjs/common';
import { AssumentsController } from './assuments.controller';
import { AssumentsService } from './assuments.service';

@Module({
  controllers: [AssumentsController],
  providers: [AssumentsService]
})
export class AssumentsModule {}
