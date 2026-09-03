import newman from 'newman';
import path from 'path';

const CARPETA_NEWMAN = path.join(__dirname, '..', 'newman');

export function  correrNewman(nombreCarpeta: string): Promise<any> {
    return new Promise((resolve, reject) => {
        newman.run({
            collection: path.join(CARPETA_NEWMAN, 'collection.json'),
            environment: path.join(CARPETA_NEWMAN, 'environment.json'),
            folder: nombreCarpeta,
            reporters: []
        },
        function (error: any, resumen: any){
            if (error){
                reject(error);
                return;
            }

            resolve(resumen);
        }
        );
    });
}