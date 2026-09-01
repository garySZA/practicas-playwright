# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: pruebaNewman.spec.ts >> correr la colecicon de postman
- Location: tests\pruebaNewman.spec.ts:4:5

# Error details

```
TypeError: _newman.default.run is not a function
```

# Test source

```ts
  1  | import newman from 'newman';
  2  | import path from 'path';
  3  | 
  4  | const CARPETA_NEWMAN = path.join(__dirname, '..', 'newman');
  5  | 
  6  | export function  correrNewman(nombreCarpeta: string): Promise<any> {
  7  |     return new Promise((resolve, reject) => {
> 8  |         newman.run({
     |                ^ TypeError: _newman.default.run is not a function
  9  |             collection: path.join(CARPETA_NEWMAN, 'collection.json'),
  10 |             environment: path.join(CARPETA_NEWMAN, 'environment.json'),
  11 |             folder: nombreCarpeta,
  12 |             reporters: []
  13 |         },
  14 |         function (error: any, resumen: any){
  15 |             if(error){
  16 |                 reject(error);
  17 |                 return;
  18 |             }
  19 | 
  20 |             resolve(resumen);
  21 |         }
  22 |     )
  23 |     })
  24 | }
```