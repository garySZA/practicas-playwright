// ============================================================
// 06 - EJERCICIOS: TU TURNO DE GRABAR
// Cada test de este archivo está incompleto a propósito.
// Sigue el PASO 7 de LAB.md: lanza `npm run record`, realiza la
// acción descrita, copia el código generado dentro del test y
// agrega al menos una assertion. Luego borra el test.skip().
// ============================================================
import { test, expect } from '@playwright/test';
import { LoginPage, USUARIOS, PASSWORD } from '../pages/LoginPage';

test.describe('Ejercicios de grabación', () => {

  // ------------------------------------------------------------
  // EJERCICIO 1
  // Graba: login con standard_user -> agregar "Sauce Labs Onesie"
  // al carrito -> ir al carrito -> quitarlo con el botón "Remove".
  // Verifica al final que el carrito quedó en 0 productos.
  // ------------------------------------------------------------
  test.skip('ejercicio 1: agregar y quitar un producto desde el carrito', async ({ page }) => {
    // 👉 Pega aquí el código grabado con codegen
    // 👉 Agrega una expect() que confirme que el carrito quedó vacío
  });

  // ------------------------------------------------------------
  // EJERCICIO 2
  // Graba: intentar loguear con locked_out_user -> capturar el
  // mensaje de error con el botón de "assert" del Inspector.
  // ------------------------------------------------------------
  test.skip('ejercicio 2: locked_out_user ve el mensaje de bloqueo', async ({ page }) => {
    // 👉 Pega aquí el código grabado con codegen
  });

  // ------------------------------------------------------------
  // EJERCICIO 3
  // Graba: login -> abrir el dropdown "Sort by" -> elegir
  // "Price (high to low)" -> verificar visualmente el primer
  // producto de la lista.
  // Pista: usa inventoryPage.obtenerPrecios() del Paso 6 del lab
  // como inspiración si quieres validarlo con datos, no solo visual.
  // ------------------------------------------------------------
  test.skip('ejercicio 3: ordenar por precio de mayor a menor', async ({ page }) => {
    // 👉 Pega aquí el código grabado con codegen
  });

  // ------------------------------------------------------------
  // EJERCICIO 4
  // Graba: login -> agregar 1 producto -> ir a checkout ->
  // completar el formulario -> en la pantalla de resumen, hacer
  // clic en "Cancel" en vez de "Finish".
  // Verifica que termina de nuevo en /inventory.html.
  // ------------------------------------------------------------
  test.skip('ejercicio 4: cancelar el checkout en la pantalla de resumen', async ({ page }) => {
    // 👉 Pega aquí el código grabado con codegen
  });

  // ------------------------------------------------------------
  // EJERCICIO 5 (desafío)
  // Graba un flujo con problem_user: agrega un producto al
  // carrito e inspecciona visualmente si notas algún bug conocido
  // de este usuario (ej. imágenes rotas). Documenta con un
  // screenshot usando page.screenshot() dentro del test.
  // ------------------------------------------------------------
  test.skip('ejercicio 5 (desafío): detectar un bug visual con problem_user', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.ir();
    await loginPage.login(USUARIOS.conProblemas, PASSWORD);

    // 👉 Continúa el flujo grabando tus propias acciones
    // 👉 Toma una captura con page.screenshot({ path: 'test-results/bug-visual.png' })
  });
});
