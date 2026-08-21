// ============================================================
// 04 - CHECKOUT COMPLETO
// Flujo grabado del PASO 5 de LAB.md: login -> agregar productos ->
// checkout -> completar datos -> revisar resumen -> finalizar
// ============================================================
import { test, expect } from '@playwright/test';
import { LoginPage, USUARIOS, PASSWORD } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test.describe('Checkout completo', () => {
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.ir();
    await loginPage.login(USUARIOS.estandar, PASSWORD);

    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
  });

  test('completar una compra de principio a fin', async () => {
    await test.step('Agregar productos al carrito', async () => {
      await inventoryPage.agregarAlCarrito('Sauce Labs Backpack');
      await inventoryPage.agregarAlCarrito('Sauce Labs Bike Light');
    });

    await test.step('Ir al carrito y comenzar el checkout', async () => {
      await inventoryPage.irAlCarrito();
      await cartPage.irACheckout();
    });

    await test.step('Completar los datos del comprador', async () => {
      await checkoutPage.completarDatos('Ana', 'Pérez', '00000');
    });

    await test.step('Revisar el resumen y finalizar', async () => {
      await expect(checkoutPage.resumenTotal).toBeVisible();
      await checkoutPage.finalizarCompra();
    });

    await test.step('Verificar la confirmación', async () => {
      await expect(checkoutPage.mensajeConfirmacion).toBeVisible();
    });
  });

  test('los datos incompletos muestran un error y no avanzan', async () => {
    await inventoryPage.agregarAlCarrito('Sauce Labs Backpack');
    await inventoryPage.irAlCarrito();
    await cartPage.irACheckout();

    await checkoutPage.inputNombre.fill('Ana');
    await checkoutPage.botonContinuar.click(); // sin apellido ni código postal

    await expect(checkoutPage.mensajeError).toBeVisible();
    await expect(checkoutPage.mensajeError).toContainText('Last Name is required');
  });

  test('cancelar el checkout regresa al carrito', async ({ page }) => {
    await inventoryPage.agregarAlCarrito('Sauce Labs Backpack');
    await inventoryPage.irAlCarrito();
    await cartPage.irACheckout();
    await checkoutPage.completarDatos('Ana', 'Pérez', '00000');

    await checkoutPage.cancelar();

    await expect(page).toHaveURL(/inventory.html/);
  });

  test('el total incluye impuestos por encima del subtotal', async ({ page }) => {
    await inventoryPage.agregarAlCarrito('Sauce Labs Backpack');
    await inventoryPage.irAlCarrito();
    await cartPage.irACheckout();
    await checkoutPage.completarDatos('Ana', 'Pérez', '00000');

    const subtotalTexto = await page.getByTestId('subtotal-label').textContent();
    const totalTexto = await page.getByTestId('total-label').textContent();

    const subtotal = parseFloat((subtotalTexto ?? '').replace(/[^\d.]/g, ''));
    const total = parseFloat((totalTexto ?? '').replace(/[^\d.]/g, ''));

    expect(total).toBeGreaterThan(subtotal);
  });
});
