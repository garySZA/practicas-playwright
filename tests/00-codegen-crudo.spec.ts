// ============================================================
// 00 - CÓDIGO "CRUDO" TAL COMO LO GENERA CODEGEN
// Este archivo simula exactamente lo que obtendrías pegando la
// salida de `npx playwright codegen https://www.saucedemo.com/`
// después de: hacer login y marcar un "assert" sobre "Products".
//
// A propósito NO está refactorizado todavía — compáralo con
// 01-login.spec.ts para ver el "antes y después".
// ============================================================
import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.getByPlaceholder('Username').click();
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByText('Products')).toBeVisible();
});

// ------------------------------------------------------------
// Así se ve grabando "agregar un producto y abrir el carrito",
// justo como codegen lo generaría paso a paso:
// ------------------------------------------------------------
test('test agregar producto', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.getByPlaceholder('Username').click();
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="shopping-cart-link"]').click();
  await expect(page.locator('.cart_item')).toHaveCount(1);
});

/*
  🔍 PROBLEMAS TÍPICOS DE ESTE CÓDIGO "CRUDO":

  1. Cada test se llama 'test' — nada describe lo que realmente valida.
  2. Hay un .click() antes de cada .fill() que no aporta nada
     (fill() ya hace foco en el campo automáticamente).
  3. El selector [data-test="add-to-cart-sauce-labs-backpack"] es
     válido, pero está "hardcodeado" — no es reutilizable para
     otros productos.
  4. El login se repite en cada test: si cambia el flujo de login,
     hay que tocar todos los archivos.
  5. No hay Page Object: la lógica de la página vive mezclada
     dentro del test.

  👉 En 01-login.spec.ts, 02-inventario-y-ordenamiento.spec.ts, etc.
     vas a ver estos mismos flujos ya refinados usando el Page
     Object Model de la carpeta pages/.
*/
