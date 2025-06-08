import { Module } from '@nestjs/common';
import { GenericoFlutterService } from './generico-flutter.service';
import { GenericoFlutterController } from './generico-flutter.controller';

@Module({
  controllers: [GenericoFlutterController],
  providers: [GenericoFlutterService],
})
export class GenericoFlutterModule {}
