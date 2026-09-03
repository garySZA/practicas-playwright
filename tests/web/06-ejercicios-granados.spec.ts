// ============================================================
// 06 - EJERCICIOS: TU TURNO DE GRABAR
// Cada test de este archivo está incompleto a propósito.
// Sigue el PASO 7 de LAB.md: lanza `npm run record`, realiza la
// acción descrita, copia el código generado dentro del test y
// agrega al menos una assertion. Luego borra el test.skip().
// ============================================================
import { test, expect } from '@playwright/test';
import { LoginPage, USUARIOS, PASSWORD } from './pages/LoginPage';

test.describe('Ejercicios de grabación', () => {

    // ------------------------------------------------------------
    // EJERCICIO 1
    // Graba: login con standard_user -> agregar "Sauce Labs Onesie"
    // al carrito -> ir al carrito -> quitarlo con el botón "Remove".
    // Verifica al final que el carrito quedó en 0 productos.
    // ------------------------------------------------------------
    test('ejercicio 1: agregar y quitar un producto desde el carrito', async ({ page }) => {
        // 👉 Pega aquí el código grabado con codegen
        await page.goto('https://www.saucedemo.com/');
        await page.locator('[data-test="username"]').click();
        await page.locator('[data-test="username"]').fill('standard_user');
        await page.locator('[data-test="password"]').click();
        await page.locator('[data-test="password"]').fill('secret_sauce');
        await page.locator('[data-test="login-button"]').click();
        await page.locator('[data-test="add-to-cart-sauce-labs-onesie"]').click();
        await page.locator('[data-test="shopping-cart-link"]').click();
        await page.locator('[data-test="remove-sauce-labs-onesie"]').click();
        // 👉 Agrega una expect() que confirme que el carrito quedó vacío
        await expect(page.locator('.cart_item')).toHaveCount(0);
    });
    // ------------------------------------------------------------
    // EJERCICIO 2
    // Graba: intentar loguear con locked_out_user -> capturar el
    // mensaje de error con el botón de "assert" del Inspector.
    // ------------------------------------------------------------
    test('ejercicio 2: locked_out_user ve el mensaje de bloqueo', async ({ page }) => {
        // 👉 Pega aquí el código grabado con codegen
        await page.goto('https://www.saucedemo.com/');
        await page.locator('[data-test="username"]').click();
        await page.locator('[data-test="username"]').fill('locked_out_user');
        await page.locator('[data-test="password"]').click();
        await page.locator('[data-test="password"]').fill('secret_sauce');
        await page.locator('[data-test="login-button"]').click();
        await expect(page.locator('[data-test="error"]')).toContainText('Sorry, this user has been locked out.');
    });

    // ------------------------------------------------------------
    // EJERCICIO 3
    // Graba: login -> abrir el dropdown "Sort by" -> elegir
    // "Price (high to low)" -> verificar visualmente el primer
    // producto de la lista.
    // Pista: usa inventoryPage.obtenerPrecios() del Paso 6 del lab
    // como inspiración si quieres validarlo con datos, no solo visual.
    // ------------------------------------------------------------
    test('ejercicio 3: ordenar por precio de mayor a menor', async ({ page }) => {
        // 👉 Pega aquí el código grabado con codegen
        await page.goto('https://www.saucedemo.com/');
        await page.locator('[data-test="username"]').click();
        await page.locator('[data-test="username"]').fill('standard_user');
        await page.locator('[data-test="password"]').click();
        await page.locator('[data-test="password"]').fill('secret_sauce');
        await page.locator('[data-test="login-button"]').click();
        await page.getByText('Name (A to Z)Name (A to Z)').click();
        await page.locator('[data-test="product-sort-container"]').selectOption('hilo');
        // Pista: usa inventoryPage.obtenerPrecios() del Paso 6 del lab
        // como inspiración si quieres validarlo con datos, no solo visual.
        await expect(page.locator('.inventory_item_name').first()).toHaveText('Sauce Labs Fleece Jacket');
    });

    // ------------------------------------------------------------
    // EJERCICIO 4
    // Graba: login -> agregar 1 producto -> ir a checkout ->
    // completar el formulario -> en la pantalla de resumen, hacer
    // clic en "Cancel" en vez de "Finish".
    // Verifica que termina de nuevo en /inventory.html.
    // ------------------------------------------------------------
    test('ejercicio 4: cancelar el checkout en la pantalla de resumen', async ({ page }) => {
        // 👉 Pega aquí el código grabado con codegen
        await page.goto('https://www.saucedemo.com/');
        await page.locator('[data-test="username"]').click();
        await page.locator('[data-test="username"]').fill('standard_user');
        await page.locator('[data-test="password"]').click();
        await page.locator('[data-test="password"]').fill('secret_sauce');
        await page.locator('[data-test="login-button"]').click();
        await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
        await page.locator('[data-test="shopping-cart-link"]').click();
        await page.locator('[data-test="checkout"]').click();
        await page.locator('[data-test="firstName"]').click();
        await page.locator('[data-test="firstName"]').fill('shirley');
        await page.locator('[data-test="lastName"]').click();
        await page.locator('[data-test="lastName"]').fill('eguivar');
        await page.locator('[data-test="postalCode"]').click();
        await page.locator('[data-test="postalCode"]').fill('00000');
        await page.locator('[data-test="continue"]').click();
        await page.locator('[data-test="cancel"]').click();
        // Verifica que termina de nuevo en /inventory.html.
        await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    });

    // ------------------------------------------------------------
    // EJERCICIO 5 (desafío)
    // Graba un flujo con problem_user: agrega un producto al
    // carrito e inspecciona visualmente si notas algún bug conocido
    // de este usuario (ej. imágenes rotas). Documenta con un
    // screenshot usando page.screenshot() dentro del test.
    // ------------------------------------------------------------
    test('ejercicio 5 (desafío): detectar un bug visual con problem_user', async ({ page }) => {
        //const loginPage = new LoginPage(page);
        //await loginPage.ir();
        //await loginPage.login(USUARIOS.conProblemas, PASSWORD);
        await page.goto('https://www.saucedemo.com/');
        await page.locator('[data-test="username"]').click();
        await page.locator('[data-test="username"]').fill('problem_user');
        await page.locator('[data-test="password"]').click();
        await page.locator('[data-test="password"]').fill('secret_sauce');
        await page.locator('[data-test="login-button"]').click();
        // 👉 Continúa el flujo grabando tus propias acciones
        await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
        // 👉 Toma una captura con page.screenshot({ path: 'test-results/bug-visual.png' })
        await page.screenshot({ path: 'test-results/bug-visual.png', fullPage: true });
    });
    // ------------------------------------------------------------
    // EJERCICIO 6 probando el login de POM
    // se corrigio playwright.config.ts  : page.getByTestId() de Playwright busca por defecto el atributo data-testid, no data-test 
    test('ejercicio 6 test POM Login', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.go();
        await loginPage.login(USUARIOS.conProblemas, PASSWORD);   
    });
});
