import { test, expect } from '@playwright/test';
import { ApiClient } from '../pages/ApiClient';



test.describe('API testing: ejemplo básico', () => {
    test('GET a una API pública', async ({ request }) => {
        const respuesta = await request.get('https://jsonplaceholder.typicode.com/users/1');    
        expect(respuesta.ok()).toBeTruthy();
        expect(respuesta.status()).toBe(200);   
    });
});



test.describe('API testing: ejemplo básico con ApiClient', () => {
    test('obtenerUsuario devuelve los datos esperados', async ({ request }) => {
        const api = new ApiClient(request);
        const usuario = await api.obtenerUsuario(2);
        const respuesta = await request.get('https://jsonplaceholder.typicode.com/users/2');
        expect(respuesta.ok()).toBeTruthy();
        expect(respuesta.status()).toBe(200);
        const cuerpo = await respuesta.json();
        expect(usuario.id).toBe(cuerpo.id);
        expect(usuario.email).toBe(cuerpo.email);
    });
});



test.describe('API testing: ejemplo básico con ApiClient', () => {
    test('crearPost devuelve el post creado con un id asignado', async ({ request }) => {
        const api = new ApiClient(request); 
        const nuevoPost = await api.crearPost({
            title: 'Reseña de Sauce Labs Backpack',
            body: 'Contenido de prueba generado desde Playwright',
            userId: 1,
        });
        const respuesta = await request.post('https://jsonplaceholder.typicode.com/posts', {
            data: {
                title: 'Reseña de Sauce Labs Backpack',
                body: 'Contenido de prueba generado desde Playwright',
                userId: 1,
            },
        });
        expect(respuesta.status()).toBe(201);
        const cuerpo = await respuesta.json();
        expect(nuevoPost.id).toBe(cuerpo.id);
        expect(nuevoPost.title).toBe(cuerpo.title);
    });
});


test.describe('API testing: ejemplo básico con  helper', () => {
    test('eliminarPost elimina un recurso', async ({ request }) => {
        
        const respuesta = await request.delete('https://jsonplaceholder.typicode.com/posts/1');
        expect(respuesta.ok()).toBeTruthy();
    });
});