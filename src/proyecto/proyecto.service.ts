import { Injectable } from '@nestjs/common';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { Proyecto, TipoProyecto } from './entities/proyecto.entity';
import { DataSource, QueryBuilder, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProyectoToUser } from './entities/ProyectoToUser.entity';
import { JwtService } from '@nestjs/jwt';
import { DateTime } from 'luxon';

@Injectable()
export class ProyectoService {

   
  constructor(
    
    @InjectRepository(Proyecto)
    private readonly proyectoRepository: Repository<Proyecto>,

    @InjectRepository(ProyectoToUser)
    private readonly proyectotouserRepository: Repository<ProyectoToUser>,
  
    private jwtService: JwtService 
  ){}


  async findAllByUser(userid:string){
    const proyectos=await this.proyectoRepository.findBy({userid:userid})
    return proyectos
  }

  async findAll(){
    return await this.proyectoRepository.find()
  }
     
  async create(jsonAsString: string, otherData: CreateProyectoDto) {
    try {
      const currentDate = DateTime.now().setZone('America/La_Paz');
      return this.proyectoRepository.save({
        data: jsonAsString,
        title: otherData.title,
        description: otherData.description,
        userid: otherData.userid,
        sala: otherData.sala,
        tipo: otherData.tipo as TipoProyecto,
        created: currentDate,
        updated: currentDate
      });
    } catch (error) {
      console.log(error, 'errores ');
    }
  }

  async findOneIntermedia(proyectoid: string) {
    const  producto= this.proyectotouserRepository.createQueryBuilder('proyecto_user')
     .where( 'proyectoid=:proyectoid', {
       proyectoid:proyectoid,
     })
     .getMany()
    return producto 
  }

  async findOneP(id:string){
    const product=await this.proyectoRepository.findBy({id:id})
    return product;
  }

  async updateNode(data:string,id:string){
    console.log(data,id)
    const currentDate = DateTime.now().setZone('America/La_Paz');
    const nodo = await this.proyectoRepository.findOneBy({id:id});  
    nodo.data = data;
    nodo.updated=currentDate
    const nodoActualizado = await this.proyectoRepository.save(nodo);
    return nodoActualizado
  }
   
 
  async updateProyecto(id:string, nuevoJsonAsString: string) {
    try {
      const proyectoExistente = await this.proyectoRepository.findOne({
        where: {id}
      });
      if (!proyectoExistente) {
        throw new Error(`Proyecto con ID ${id} no encontrado.`);
      }
      proyectoExistente.data = nuevoJsonAsString;
      return this.proyectoRepository.save(proyectoExistente);
    }  
    catch (error) {
      console.log(error, 'Error al actualizar el proyecto');
      throw error; // Puedes manejar el error según sea necesario en tu aplicación
    }
  }
  


  async delete(id:string){
    const proyectoExistente = await this.proyectoRepository.findOne({
      where: {id}
    });
    if (!proyectoExistente) {
      throw new Error(`Proyecto con ID ${id} no encontrado.`);
    }
    return this.proyectoRepository.remove(proyectoExistente);
  }
  generateSecureUrl(userId: string): string {
    const token = this.jwtService.sign({ userId });
    return `http://localhost:3000/api/proyecto?token=${token}`;
  }

}
