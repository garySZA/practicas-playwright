// ============================================================
// 05 - LOGOUT Y SESIÓN
// Flujo grabado: abrir el menú hamburguesa -> Logout -> verificar
// que regresa al login y que la sesión ya no es válida
// ============================================================
import { test, expect } from '@playwright/test';
import { LoginPage, USUARIOS, PASSWORD } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

test.describe('Logout y manejo de sesión', () => {
  test('cerrar sesión regresa a la pantalla de login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.ir();
    await loginPage.login(USUARIOS.estandar, PASSWORD);

    const inventoryPage = new InventoryPage(page);
    await inventoryPage.cerrarSesion();

    await expect(loginPage.inputUsuario).toBeVisible();
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });

  test('acceder a /inventory.html sin sesión redirige al login', async ({ page }) => {
    await page.goto('/inventory.html');

    // SauceDemo no deja ver el inventario sin loguearse antes
    const loginPage = new LoginPage(page);
    await loginPage.esperarErrorVisible('You can only access');
  });

  test('el carrito se vacía visualmente después de cerrar sesión y volver a entrar', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.ir();
    await loginPage.login(USUARIOS.estandar, PASSWORD);

    const inventoryPage = new InventoryPage(page);
    await inventoryPage.agregarAlCarrito('Sauce Labs Backpack');
    await inventoryPage.cerrarSesion();

    // Vuelve a entrar
    await loginPage.login(USUARIOS.estandar, PASSWORD);
    await expect(inventoryPage.contadorCarrito).toHaveCount(0);
  });
});
