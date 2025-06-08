import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Proyecto } from './proyecto.entity';
import { User } from "src/auth/entities/user.entity";

@Entity()
export class ProyectoToUser {
  @PrimaryGeneratedColumn()
  id: number
  
    @Column({
    nullable:false,
    })  
    userid:string
    @Column({
      nullable:false,
      })  
      proyectoid:string 


  
  @ManyToOne(() => User, (user) => user.proyectotouser ,{
    onDelete: 'CASCADE'
  })
  @JoinColumn(
    {
      name:'userid'
    }
   )
   user: User

    @ManyToOne(()=>Proyecto,(proyecto)=>proyecto.proyectotouser,
   {onDelete: 'CASCADE'}  
   )
   @JoinColumn(
    {
      name:'proyectoid'
    }
   )
    proyecto=Proyecto 


}