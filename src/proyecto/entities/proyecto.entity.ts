import { User } from "src/auth/entities/user.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProyectoToUser } from "./ProyectoToUser.entity";

export enum TipoProyecto {
  BOCETO = 'boceto',
  FIGMA = 'figma',
  FLUUTERFIGMA = 'flutterfigma',
}

@Entity()
export class Proyecto {

  @PrimaryGeneratedColumn('uuid')
   id:string;

   @Column('text')
    title:string;
    
    @Column('text')
    description:string;
   
     
    @Column({
      nullable:true
    }) 
     created:string

     @Column({
      nullable:true
    })
     updated:string
     
     @Column('text',{
      nullable:true
    })
    sala:string
 
     @Column({
      type: 'enum',
      enum: TipoProyecto,
      default: TipoProyecto.BOCETO
     })
     tipo: TipoProyecto;

    @Column('text')
    userid:string;    
    
    @Column('text',{
      nullable:true
     }) 
     data: string;  

    @ManyToOne(()=>User,(user)=>user.proyects,
     {onDelete: 'CASCADE'}  
    )
    @JoinColumn({name:'userid'})
     user:User

    @OneToMany(() =>ProyectoToUser ,proyectotouser =>proyectotouser.proyecto)
     proyectotouser?: ProyectoToUser[];

}
