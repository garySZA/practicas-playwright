// ============================================================
// 06 - EJERCICIOS: refinando los ejercicios con POM
// ============================================================
import { test, expect } from '@playwright/test';
import { LoginPage, USUARIOS, PASSWORD } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test.describe('Ejercicios de grabación', () => {

  // ------------------------------------------------------------
  // EJERCICIO 1
  // Graba: login con standard_user -> agregar "Sauce Labs Onesie"
  // al carrito -> ir al carrito -> quitarlo con el botón "Remove".
  // Verifica al final que el carrito quedó en 0 productos.
  // ------------------------------------------------------------
  test('ejercicio 1: agregar y quitar un producto desde el carrito', async ({ page }) => {
    // logim con POM
    const loginPage = new LoginPage(page);
    await loginPage.ir();
    await loginPage.login(USUARIOS.estandar, PASSWORD);   
    // agregar producto 'Sauce Labs Onesie' al carrito con POM
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.agregarAlCarrito('Sauce Labs Onesie');
    await inventoryPage.irAlCarrito();
    // quitar producto  'Sauce Labs Onesie' del carrito con POM
    const cartPage = new CartPage(page);
    await cartPage.quitarProducto('Sauce Labs Onesie');
   
    // 👉 Agrega una expect() que confirme que el carrito quedó vacío con POM
    await expect(cartPage.items).toHaveCount(0);
  });
// ------------------------------------------------------------
  // EJERCICIO 2
  // Graba: intentar loguear con locked_out_user -> capturar el
  // mensaje de error con el botón de "assert" del Inspector.
  // ------------------------------------------------------------
  test('ejercicio 2: locked_out_user ve el mensaje de bloqueo', async ({ page }) => {
 // logim con POM
    const loginPage = new LoginPage(page);
    await loginPage.ir();
    await loginPage.login(USUARIOS.bloqueado, PASSWORD);   
    // capturar el mensaje de error con el botón de "assert" del Inspector.
    // se reemplazo la linea cruda con loginPage.esperarErrorVisible
    //await expect(page.locator('[data-test="error"]')).toContainText('Sorry, this user has been locked out.');
    await loginPage.esperarErrorVisible('Sorry, this user has been locked out.');
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
  // logim con POM
    const loginPage = new LoginPage(page);
    await loginPage.ir();
    await loginPage.login(USUARIOS.estandar, PASSWORD);   
  //  ordenar por hilo
  //  await page.getByText('Name (A to Z)Name (A to Z)').click();
  //  await page.locator('[data-test="product-sort-container"]').selectOption('hilo');
  const inventoryPage = new InventoryPage(page);
  await inventoryPage.ordenarPor('hilo');
  // Validación del primer producto de la lista
  // await expect(page.locator('.inventory_item_name').first()).toHaveText('Sauce Labs Fleece Jacket');
  await expect(inventoryPage.productos.first()).toContainText('Sauce Labs Fleece Jacket');

  });

  // ------------------------------------------------------------
  // EJERCICIO 4
  // Graba: login -> agregar 1 producto -> ir a checkout ->
  // completar el formulario -> en la pantalla de resumen, hacer
  // clic en "Cancel" en vez de "Finish".
  // Verifica que termina de nuevo en /inventory.html.
  // ------------------------------------------------------------
  test('ejercicio 4: cancelar el checkout en la pantalla de resumen', async ({ page }) => {
  // logim con POM
    const loginPage = new LoginPage(page);
    await loginPage.ir();
    await loginPage.login(USUARIOS.estandar, PASSWORD); 
  // AGREGA PRODUCTO auce-labs-bike-light AL CARRITO
  //    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
  //    await page.locator('[data-test="shopping-cart-link"]').click();
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.agregarAlCarrito('Sauce Labs Bike Light');
    await inventoryPage.irAlCarrito();
  // IR AL CHECKOUT
    // await page.locator('[data-test="checkout"]').click();
     const cartPage = new CartPage(page);
     await cartPage.irACheckout();
  // LLENAR FORMULARIO CON shirley eguivar 00000
    //  await page.locator('[data-test="firstName"]').click();
    //  await page.locator('[data-test="firstName"]').fill('shirley');
    // await page.locator('[data-test="lastName"]').click();
    //  await page.locator('[data-test="lastName"]').fill('eguivar');
    //  await page.locator('[data-test="postalCode"]').click();
    //  await page.locator('[data-test="postalCode"]').fill('00000');
    // await page.locator('[data-test="continue"]').click();
  const checkoutPage = new CheckoutPage(page);
  await checkoutPage.completarDatos('Shirley', 'Eguivar', '00000');
  // CLICK en "Cancel" en vez de "Finish".
    //  await page.locator('[data-test="cancel"]').click();
  await checkoutPage.cancelar();
  // Verifica que termina de nuevo en /inventory.html.
    //  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
     await expect(page).toHaveURL(/inventory.html/);
  });

  // ------------------------------------------------------------
  // EJERCICIO 5 (desafío)
  // Graba un flujo con problem_user: agrega un producto al
  // carrito e inspecciona visualmente si notas algún bug conocido
  // de este usuario (ej. imágenes rotas). Documenta con un
  // screenshot usando page.screenshot() dentro del test.
  // ------------------------------------------------------------
  test('ejercicio 5 (desafío): detectar un bug visual con problem_user', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.ir();
    await loginPage.login(USUARIOS.conProblemas, PASSWORD);   
    // AGREGA PRIDUCTO AL CARRITO 
    //   await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.agregarAlCarrito('Sauce Labs Bike Light');   
   // 👉 Toma una captura con page.screenshot({ path: 'test-results/bug-visual.png' })
    await page.screenshot({ path: 'test-results/bug-visual.png', fullPage: true });   
  });
 // ------------------------------------------------------------
 // EJERCICIO 6 probando el login de POM
 // se corrigio playwright.config.ts  : page.getByTestId() de Playwright busca por defecto el atributo data-testid, no data-test 
  test('ejercicio 6 test POM Login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.ir();
    await loginPage.login(USUARIOS.conProblemas, PASSWORD);   
  });
});
