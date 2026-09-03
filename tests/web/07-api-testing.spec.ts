// ============================================================
// 07 - API TESTING
// SauceDemo no tiene una API REST propia (es un sitio estático de
// práctica), así que esta sección usa JSONPlaceholder — una API
// pública gratuita — para enseñar los fundamentos de API testing
// con el fixture `request` de Playwright, y luego combina esos
// datos con el flujo de UI de SauceDemo ya construido en el resto
// del laboratorio.
//
// Progresión de este archivo (igual que el resto del lab):
//   1. Peticiones básicas (GET/POST) "crudas", sin helper
//   2. Las mismas peticiones usando el ApiClient (refinado)
//   3. Combinar API + UI en un mismo test
// ============================================================
import { test, expect } from '@playwright/test';
import { ApiClient, UsuarioAPI } from './pages/ApiClient';
import { LoginPage, USUARIOS, PASSWORD } from './pages/LoginPage';

import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ProductsPage } from './pages/Products';

test.describe('API testing: fundamentos (sin helper)', () => {
    test('GET a una API pública', async ({ request }) => {
        const respuesta = await request.get('https://jsonplaceholder.typicode.com/users/1');

        // El fixture `request` no abre ningún navegador — es un cliente HTTP directo
        expect(respuesta.ok()).toBeTruthy();
        expect(respuesta.status()).toBe(200);

        const cuerpo = await respuesta.json();
        expect(cuerpo).toHaveProperty('name');
        expect(cuerpo.id).toBe(1);
    });

    test('GET a un recurso que no existe devuelve 404', async ({ request }) => {
        const respuesta = await request.get('https://jsonplaceholder.typicode.com/users/99999');
        expect(respuesta.status()).toBe(404);
    });

    test('POST enviando un body JSON', async ({ request }) => {
        const respuesta = await request.post('https://jsonplaceholder.typicode.com/posts', {
            data: {
                title: 'Mi primer post de prueba',
                body: 'Contenido de prueba generado desde Playwright',
                userId: 1,
            },
        });

        expect(respuesta.status()).toBe(201); // 201 Created
        const cuerpo = await respuesta.json();
        expect(cuerpo.title).toBe('Mi primer post de prueba');
    });

    test('DELETE elimina un recurso', async ({ request }) => {
        const respuesta = await request.delete('https://jsonplaceholder.typicode.com/posts/1');
        expect(respuesta.ok()).toBeTruthy();
    });
});

test.describe('API testing: refinado con ApiClient', () => {
    test('obtenerUsuario devuelve los datos esperados', async ({ request }) => {
        const api = new ApiClient(request);
        const usuario: UsuarioAPI = await api.obtenerUsuario(2);

        expect(usuario.id).toBe(2);
        expect(usuario.email).toContain('@');
    });

    test('crearPost devuelve el post creado con un id asignado', async ({ request }) => {
        const api = new ApiClient(request);

        const nuevoPost = await api.crearPost({
            title: 'Reseña de Sauce Labs Backpack',
            body: 'Excelente para llevar la laptop al trabajo.',
            userId: 3,
        });

        expect(nuevoPost.title).toBe('Reseña de Sauce Labs Backpack');
        expect(nuevoPost).toHaveProperty('id');
    });

    test('parametrizado: obtener varios usuarios y validar su forma', async ({ request }) => {
        const api = new ApiClient(request);
        const ids = [1, 2, 3];

        for (const id of ids) {
            const usuario = await api.obtenerUsuario(id);
            expect(usuario.id).toBe(id);
            expect(usuario.username).toBeTruthy();
        }
    });
});

test.describe('Combinar API + UI', () => {
    test('usar un nombre real obtenido por API para completar el checkout de SauceDemo', async ({
        request,
        page,
    }) => {
        // 1. Preparamos datos reales con una llamada a la API — mucho más rápido
        //    que si tuviéramos que generarlos navegando manualmente
        const api = new ApiClient(request);
        const usuario = await api.obtenerUsuario(4);
        const [nombre, apellido] = usuario.name.split(' ');

        // 2. Usamos la UI de SauceDemo solo para lo que realmente hay que ver
        //    renderizado: el login, el carrito y el checkout
        const loginPage = new LoginPage(page);
        await loginPage.go();
        await loginPage.login(USUARIOS.standard, PASSWORD);

        const inventoryPage = new ProductsPage(page);
        await inventoryPage.agregarProducto('Sauce Labs Backpack');
        await inventoryPage.irACarrito();

        const cartPage = new CartPage(page);
        await cartPage.irACheckout();

        const checkoutPage = new CheckoutPage(page);
        await checkoutPage.completarDatos(nombre, apellido ?? 'Apellido', '00000');
        await checkoutPage.finalizarCompra();

        // 3. Verificamos el resultado final combinando ambos mundos
        await expect(checkoutPage.mensajeConfirmacion).toBeVisible();
    });

    test('validar por API antes de decidir qué probar en la UI', async ({ request, page }) => {
        const api = new ApiClient(request);
        const usuario = await api.obtenerUsuario(5);

        // La API nos dice si el usuario "existe"; solo si es válido probamos la UI.
        // Este patrón evita perder tiempo en pasos de UI cuando la precondición
        // ya se puede descartar más rápido por API.
        expect(usuario.email).toBeTruthy();

        const loginPage = new LoginPage(page);
        await loginPage.go();
        await loginPage.login(USUARIOS.standard, PASSWORD);

        await expect(page).toHaveURL(/inventory.html/);
    });
});
