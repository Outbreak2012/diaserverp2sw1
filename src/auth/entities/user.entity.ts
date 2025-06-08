import { Proyecto } from 'src/proyecto/entities/proyecto.entity';
import { ProyectoToUser } from 'src/proyecto/entities/ProyectoToUser.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column('text', {
    unique: true,
  })

  email: string;
  @Column('text', {
    select: false,
  })
  password: string;
  
  @Column('text')
  name: string;

  
  @Column('text')
  lastName: string;



  @Column('bool', {
    default: true,
  })
  isActive: boolean;

  @Column('text', {
    array: true,
    default: ['user'],
  })
  roles: string[];
 
  @OneToMany(
   ()=>Proyecto,(proyects)=>proyects.userid,
   {cascade:true,eager:false}
  ) 
  proyects?:Proyecto[]


   @OneToMany(() =>ProyectoToUser,(proyectotouser) =>proyectotouser.user)
    proyectotouser?: ProyectoToUser[];




  @BeforeInsert() //trigger
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }  
  @BeforeUpdate() //trigger
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert();
  }
}
