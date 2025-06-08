import { Module } from '@nestjs/common';
import { ProyectoService } from './proyecto.service';
import { ProyectoController } from './proyecto.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proyecto } from './entities/proyecto.entity';
import { ProyectoToUser } from './entities/ProyectoToUser.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ProyectoController],
  providers: [ProyectoService],
  imports:[
    TypeOrmModule.forFeature([
      Proyecto,ProyectoToUser
    ]),AuthModule
  ],
  exports:[
    ProyectoService,
    TypeOrmModule
  ],

})
export class ProyectoModule {}
