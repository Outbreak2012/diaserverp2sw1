import { Controller, Get, Post, Body, Query, Res } from '@nestjs/common';
import { GenericoFlutterService } from './generico-flutter.service';
import { Response } from 'express';
import { FlutterComponentDto } from './fluttercomponente';

@Controller('genericoflutter')
export class GenericoFlutterController {
  constructor(
    private readonly genericoFlutterService: GenericoFlutterService,
   
  ) {}

  @Get('list')
  async listFiles(@Query('dir') dir: string = '') {
    return this.genericoFlutterService.listFiles(dir);
  }

  @Get('read')
  async readFile(@Query('file') file: string) {
    return this.genericoFlutterService.readFile(file);
  }

  @Post('write')
  async writeFile(@Body() body: { file: string; content: string }) {
    await this.genericoFlutterService.writeFile(body.file, body.content);
    return { success: true };
  }

  @Post('create')
  async createFile(@Body() body: { file: string; content?: string }) {
    await this.genericoFlutterService.createFile(body.file, body.content || '');
    return { success: true };
  }

  @Get('zip')
  async zipFolder(@Res() res: Response) {
    console.log('Zipping folder...');
    await this.genericoFlutterService.zipFolder(res);
  }

  // DTO para tipar la petición y evitar errores de estructura
 

  @Post('create-files-zip')
  async createFilesAndZip(
    @Body() body: { files: FlutterComponentDto[] },
    @Res() res: Response
  ) {
    //console.log('componentes en el controller', body.files);
    await this.genericoFlutterService.createFilesAndZip(body.files, res);
  }



  @Post('analyze')
  async analyzeFlutterCode(@Body() body: { files: FlutterComponentDto[] }) {
    // 1. Guardar los archivos recibidos
    await this.genericoFlutterService.createFilesAndZip(body.files, null); // null porque no queremos zip, solo guardar
    // 2. Ejecutar flutter analyze
    const { exec } = require('child_process');
    const cwd = this.genericoFlutterService['basePath'];
    return new Promise((resolve) => {
      exec('flutter analyze', { cwd }, (error, stdout, stderr) => {
        // 3. Limpiar archivos y rutas generadas
        this.genericoFlutterService.createFilesAndZip(body.files, null).finally(() => {
          if (error) {
            resolve({ success: false, output: stderr || stdout });
          } else {
            resolve({ success: true, output: stdout });
          }
        });
      });
    });
  }

  


}
