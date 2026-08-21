// ============================================================
// 02 - INVENTARIO Y ORDENAMIENTO
// Flujo grabado: login -> cambiar el dropdown "Sort by" -> verificar orden
// ============================================================
import { test, expect } from '@playwright/test';
import { LoginPage, USUARIOS, PASSWORD } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

test.describe('Inventario de productos', () => {
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.ir();
    await loginPage.login(USUARIOS.estandar, PASSWORD);

    inventoryPage = new InventoryPage(page);
  });

  test('se muestran 6 productos por defecto', async () => {
    await expect(inventoryPage.productos).toHaveCount(6);
  });

  test('ordenar por nombre A-Z', async () => {
    await inventoryPage.ordenarPor('az');

    const nombres = await inventoryPage.obtenerNombres();
    const ordenados = [...nombres].sort((a, b) => a.localeCompare(b));
    expect(nombres).toEqual(ordenados);
  });

  test('ordenar por nombre Z-A', async () => {
    await inventoryPage.ordenarPor('za');

    const nombres = await inventoryPage.obtenerNombres();
    const ordenados = [...nombres].sort((a, b) => b.localeCompare(a));
    expect(nombres).toEqual(ordenados);
  });

  test('ordenar por precio de menor a mayor', async () => {
    await inventoryPage.ordenarPor('lohi');

    const precios = await inventoryPage.obtenerPrecios();
    const ordenados = [...precios].sort((a, b) => a - b);
    expect(precios).toEqual(ordenados);
  });

  test('ordenar por precio de mayor a menor', async () => {
    await inventoryPage.ordenarPor('hilo');

    const precios = await inventoryPage.obtenerPrecios();
    const ordenados = [...precios].sort((a, b) => b - a);
    expect(precios).toEqual(ordenados);
  });

  test('el botón cambia a "Remove" después de agregar un producto', async () => {
    const nombreProducto = 'Sauce Labs Backpack';
    await inventoryPage.agregarAlCarrito(nombreProducto);

    const producto = inventoryPage.productoPorNombre(nombreProducto);
    await expect(producto.getByRole('button', { name: 'Remove' })).toBeVisible();
    await expect(inventoryPage.contadorCarrito).toHaveText('1');
  });
});
