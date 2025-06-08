import { IsDate, IsJSON, IsPositive, IsString, IsUUID, MinLength, isUUID } from "class-validator";
import { UUID } from "crypto";

export class CreateProyectoDto {

 @IsString()
 @MinLength(7)
 title:string;

 @IsString()
 description:string;


 @IsString()
 userid:string;

 @IsString()
 sala:string;

 @IsString()
 tipo:string;

 @IsJSON()
 data?: any;
}
