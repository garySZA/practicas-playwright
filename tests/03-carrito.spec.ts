// ============================================================
// 03 - CARRITO DE COMPRAS
// Flujo grabado: agregar varios productos -> abrir carrito -> quitar uno
// ============================================================
import { test, expect } from '@playwright/test';
import { LoginPage, USUARIOS, PASSWORD } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';

test.describe('Carrito de compras', () => {
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.ir();
    await loginPage.login(USUARIOS.estandar, PASSWORD);

    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
  });

  test('agregar varios productos y verlos en el carrito', async () => {
    const productos = ['Sauce Labs Backpack', 'Sauce Labs Bike Light', 'Sauce Labs Bolt T-Shirt'];

    for (const producto of productos) {
      await inventoryPage.agregarAlCarrito(producto);
    }

    await expect(inventoryPage.contadorCarrito).toHaveText(String(productos.length));

    await inventoryPage.irAlCarrito();
    await expect(cartPage.items).toHaveCount(productos.length);
  });

  test('quitar un producto desde el carrito', async () => {
    await inventoryPage.agregarAlCarrito('Sauce Labs Backpack');
    await inventoryPage.agregarAlCarrito('Sauce Labs Fleece Jacket');
    await inventoryPage.irAlCarrito();

    await cartPage.quitarProducto('Sauce Labs Backpack');

    await expect(cartPage.items).toHaveCount(1);
    await expect(cartPage.itemPorNombre('Sauce Labs Fleece Jacket')).toBeVisible();
  });

  test('el carrito vacío no muestra el contador', async () => {
    await expect(inventoryPage.contadorCarrito).toHaveCount(0);
  });

  test('"Continue Shopping" regresa al inventario', async ({ page }) => {
    await inventoryPage.agregarAlCarrito('Sauce Labs Backpack');
    await inventoryPage.irAlCarrito();

    await cartPage.seguirComprando();

    await expect(page).toHaveURL(/inventory.html/);
  });
});
