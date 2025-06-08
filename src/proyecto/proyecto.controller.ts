import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProyectoService } from './proyecto.service';
import { Auth } from 'src/auth/decorators';
import { CreateProyectoDto } from './dto/create-proyecto.dto';


@Controller('proyecto')
export class ProyectoController {
  constructor(private readonly proyectoService: ProyectoService) {}  
  @Post()
  create(@Body() body:CreateProyectoDto) {
     const{ data,...datos} =body
     const jsonAsString = JSON.stringify(data);
     return this.proyectoService.create(jsonAsString, datos);
  }

  @Get()
  findAll() {
    return this.proyectoService.findAll();
  }

  

  @Post('/nodes')
  updateNodes(@Body() data:any,@Query('id') id:string) {
    console.log('data', data);
    const jsonAsString = JSON.stringify(data);
    return this.proyectoService.updateNode(jsonAsString,id);  
  }

  @Get('user/:id')
  findOnByUser(@Param('id') id: string) {
    return this.proyectoService.findAllByUser(id);
  }

  @Get('/:id')
  findOnById(@Param('id') id: string) {
    return this.proyectoService.findOneP(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.proyectoService.delete(id);
  } 
}
