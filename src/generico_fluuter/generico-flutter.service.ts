import { Injectable } from '@nestjs/common';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as archiver from 'archiver';
import { Response } from 'express';
import { exec } from 'child_process';

@Injectable()
export class GenericoFlutterService {
  private basePath = path.join(process.cwd(), 'src', 'seed', 'generico_fluuter');

  
  getFullPath(relativePath: string = ''): string {
    return path.join(this.basePath, relativePath);
  }

  async listFiles(dir = ''): Promise<any[]> {
    const fullPath = this.getFullPath(dir);
    const files = await fs.readdir(fullPath, { withFileTypes: true });
    return files.map(f => ({
      name: f.name,
      isDirectory: f.isDirectory(),
      path: path.join(dir, f.name)
    }));
  }

  async readFile(filePath: string): Promise<string> {
    const fullPath = this.getFullPath(filePath);
    return fs.readFile(fullPath, 'utf8');
  }

  async writeFile(filePath: string, content: string): Promise<void> {
    const fullPath = this.getFullPath(filePath);
    await fs.ensureFile(fullPath);
    await fs.writeFile(fullPath, content, 'utf8');
  }

  async createFile(filePath: string, content: string = ''): Promise<void> {
    const fullPath = this.getFullPath(filePath);
    await fs.ensureFile(fullPath);
    await fs.writeFile(fullPath, content, 'utf8');
  }

  async zipFolder(res: Response): Promise<void> {
    //console.log('Zipping folder...',res);
    const archive = archiver('zip', { zlib: { level: 9 } });
    res.attachment('generico_fluuter.zip');
    archive.directory(this.basePath, false);
    archive.pipe(res);
    await archive.finalize();
  }

  /**
   * Recibe un array de objetos { className: string, content: string } y crea los archivos en lib/pages,
   * luego agrega la ruta en lib/routes/app_routes.dart para cada componente.
   */
  async createPagesAndAddRoutes(components: { classname: string; content: string }[]): Promise<void> {
    const pagesPath = this.getFullPath('lib/pages');
    const routesPath = this.getFullPath('lib/routes/app_routes.dart');
    // Leer el archivo de rutas actual
    let routesContent = await fs.readFile(routesPath, 'utf8');
    for (const comp of components) {
      // 1. Crear archivo en lib/pages
      const fileName = `${this.toSnakeCase(comp.classname)}_page.dart`;
      const filePath = path.join(pagesPath, fileName);
      await fs.ensureFile(filePath);
      await fs.writeFile(filePath, comp.content, 'utf8');
      // 2. Agregar ruta en app_routes.dart si no existe
      const routeName = `/${this.toSnakeCase(comp.classname)}`;
      const importLine = `import '../pages/${fileName}';`;
      if (!routesContent.includes(importLine)) {
        // Insertar import después del último import
        routesContent = routesContent.replace(/(import .+;\s*)+/, match => match + importLine + '\n');
      }
      // Insertar case en generateRoute
      const caseLine = `      case '${routeName}':\n        return MaterialPageRoute(builder: (_) => const ${comp.classname}());`;
      if (!routesContent.includes(caseLine)) {
        routesContent = routesContent.replace(/(switch \(settings.name\) {)/, `$1\n${caseLine}`);
      }
    }
    await fs.writeFile(routesPath, routesContent, 'utf8');
  }

  /**
   * Crea o actualiza el home_page.dart con botones para navegar a los componentes generados.
   */
  private async updateHomePage(components: { classname: string }[]): Promise<void> {
    const homePath = this.getFullPath('lib/pages/home_page.dart');
    // Generar los botones
    const buttons = components.map(comp => {
      const route = `/${this.toSnakeCase(comp.classname)}`;
      return `ElevatedButton(
            onPressed: () => Navigator.pushNamed(context, '${route}'),
            child: Text('${comp.classname}'),
          )`;
    }).join(',\n          ');
    // Generar el contenido del home
    const content = `import 'package:flutter/material.dart';\n\nclass HomePage extends StatelessWidget 
    {\n  const HomePage({super.key});\n\n  @override\n  Widget build(BuildContext context)
     {\n    return Scaffold(\n      appBar: AppBar(title: const Text('Componentes generados')),\n   
        body: Center(\n        child: SingleChildScrollView(\n          child: Column(\n      
              mainAxisAlignment: MainAxisAlignment.center,\n           
               children: [\n              ${buttons}\n          
                 ],\n          ),\n        ),\n      ),\n    );\n  }\n}\n`;
    await fs.writeFile(homePath, content, 'utf8');
  }

  /**
   * Recibe un array de objetos { className: string, content: string }, crea los archivos en lib/pages,
   * agrega la ruta en lib/routes/app_routes.dart, genera el zip y borra los archivos creados.
   */
  async createFilesAndZip(components: { classname: string; content: string }[], res: Response): Promise<void> {
    const pagesPath = this.getFullPath('lib/pages');
    const routesPath = this.getFullPath('lib/routes/app_routes.dart');
    const homePath = this.getFullPath('lib/pages/home_page.dart');
    const createdFiles: string[] = [];
    try {
      // Crear archivos y agregar rutas
      await this.createPagesAndAddRoutes(components);
      // Actualizar el home con los botones
      await this.updateHomePage(components);
      // Guardar los paths de los archivos creados para borrarlos después
      for (const comp of components) {
        const fileName = `${this.toSnakeCase(comp.classname)}_page.dart`;
        const filePath = path.join(pagesPath, fileName);
        createdFiles.push(filePath);
      }
      // Generar zip de toda la carpeta generico_fluuter
      await this.zipFolder(res);
    }  finally {
      // Borrar los archivos creados
      for (const filePath of createdFiles) {
        await fs.remove(filePath);
      }

      
      // Limpiar rutas de app_routes.dart
      let routesContent = await fs.readFile(routesPath, 'utf8');
      for (const comp of components) {
        const fileName = `${this.toSnakeCase(comp.classname)}_page.dart`;
        const importLine = `import '../pages/${fileName}';\n`;
        const routeName = `/${this.toSnakeCase(comp.classname)}`;
        const caseLine = `      case '${routeName}':\n        return MaterialPageRoute(builder: (_) => const ${comp.classname}());`;
        // Eliminar import
        routesContent = routesContent.replace(importLine, '');
        // Eliminar case
        routesContent = routesContent.replace(caseLine, '');
        console.log(`Eliminando import y case para ${comp.classname}`);
      }
      await fs.writeFile(routesPath, routesContent, 'utf8');

      // Limpiar botones del home_page.dart
      let homeContent = await fs.readFile(homePath, 'utf8');
      for (const comp of components) {
        // El botón ocupa varias líneas, así que eliminamos por el texto del botón
        const buttonRegex = new RegExp(
          `ElevatedButton\\([\\s\\S]*?Navigator\\.pushNamed\\(context, '/${this.toSnakeCase(comp.classname)}'\\)[\\s\\S]*?Text\\('${comp.classname}'\\)[\\s\\S]*?\\),?\\n?`,
          'g'
        );
        homeContent = homeContent.replace(buttonRegex, '');
      }
      await fs.writeFile(homePath, homeContent, 'utf8');
    }
  }

  // Utilidad para convertir CamelCase a snake_case
  private toSnakeCase(str: string): string {
    return str.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
  }


}
