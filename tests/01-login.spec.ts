// ============================================================
// 01 - LOGIN (refinado a partir de lo grabado con codegen)
// Compara esto con tests/00-codegen-crudo.spec.ts
// ============================================================
import { test, expect } from '@playwright/test';
import { LoginPage, USUARIOS, PASSWORD } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

test.describe('Login en SauceDemo', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.ir();
  });

  test('login exitoso con standard_user', async ({ page }) => {
    await loginPage.login(USUARIOS.estandar, PASSWORD);

    const inventoryPage = new InventoryPage(page);
    await expect(inventoryPage.titulo).toBeVisible();
    await expect(page).toHaveURL(/inventory.html/);
  });

  test('locked_out_user recibe un mensaje de cuenta bloqueada', async () => {
    await loginPage.login(USUARIOS.bloqueado, PASSWORD);

    await loginPage.esperarErrorVisible('Sorry, this user has been locked out.');
  });

  test('password incorrecta muestra un error genérico', async () => {
    await loginPage.login(USUARIOS.estandar, 'password-incorrecta');

    await loginPage.esperarErrorVisible('Username and password do not match');
  });

  test('campos vacíos no permiten iniciar sesión', async () => {
    await loginPage.botonLogin.click();

    await loginPage.esperarErrorVisible('Username is required');
  });

  // --- Parametrización: probar todos los usuarios "problemáticos" que sí loguean ---
  const usuariosQueSiLoguean = [
    USUARIOS.estandar,
    USUARIOS.conProblemas,
    USUARIOS.lento,
    USUARIOS.conErrores,
    USUARIOS.visual,
  ];

  for (const usuario of usuariosQueSiLoguean) {
    test(`"${usuario}" logra iniciar sesión correctamente`, async ({ page }) => {
      test.setTimeout(45_000); // performance_glitch_user es intencionalmente lento
      await loginPage.login(usuario, PASSWORD);
      await expect(page).toHaveURL(/inventory.html/);
    });
  }
});
