# Laboratorio Playwright: Grabación (Codegen) contra SauceDemo 🎥🛒

Laboratorio práctico para aprender a usar **Playwright Codegen** — la herramienta que
graba tus acciones en el navegador y genera el código del test automáticamente —
usando **[saucedemo.com](https://www.saucedemo.com/)**, el sitio demo estándar para
practicar QA/automatización.

## 🧑‍🎓 Usuarios de prueba de SauceDemo

SauceDemo tiene usuarios predefinidos, todos con la misma contraseña `secret_sauce`.
Los vamos a usar durante todo el laboratorio:

| Usuario                   | Comportamiento                                            |
|----------------------------|------------------------------------------------------------|
| `standard_user`            | Flujo normal, sin problemas.                               |
| `locked_out_user`          | Login rechazado con mensaje de error (cuenta bloqueada).   |
| `problem_user`             | Login correcto, pero con bugs visuales/funcionales a propósito. |
| `performance_glitch_user`  | Login correcto, pero con demoras artificiales.             |
| `error_user`               | Login correcto, pero con errores en ciertas acciones.      |
| `visual_user`               | Login correcto, pensado para pruebas de regresión visual.  |

Contraseña para todos: **`secret_sauce`**

---

## 📁 Estructura del laboratorio

```
playwright-lab-saucedemo/
├── package.json
├── tsconfig.json
├── playwright.config.ts
├── LAB.md                                  # esta guía
├── pages/                                  # Page Object Model (destino final del refactor)
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   └── CheckoutPage.ts
└── tests/
    ├── 00-codegen-crudo.spec.ts             # ejemplo de lo que codegen genera "en crudo"
    ├── 01-login.spec.ts
    ├── 02-inventario-y-ordenamiento.spec.ts
    ├── 03-carrito.spec.ts
    ├── 04-checkout-completo.spec.ts
    ├── 05-logout-y-sesion.spec.ts
    └── 06-ejercicios-para-grabar.spec.ts    # plantillas vacías para que completes grabando
```

## 🚀 Instalación

```bash
cd playwright-lab-saucedemo
npm install
npx playwright install
```

---

## PASO 1 — Lanzar el grabador (Codegen)

Codegen abre **dos ventanas**: un navegador controlado y el **Playwright Inspector**
(el panel donde aparece el código generado en vivo).

```bash
npx playwright codegen https://www.saucedemo.com/
```

También puedes usar el script ya definido en este proyecto:

```bash
npm run record
```

**Qué vas a ver:**
- Una ventana de Chrome apuntando a SauceDemo.
- Una ventana aparte, el **Inspector**, con el código TypeScript/JavaScript que se
  genera automáticamente a medida que haces clic, escribes o navegas.
- Un botón para elegir el lenguaje/formato de salida (Playwright Test, Python, Java, etc.)
  y otro para **grabar/pausar** (Record on/off).

<details>
<summary>💡 Otras formas útiles de lanzar codegen</summary>

```bash
# Guardar el código generado directamente en un archivo .spec.ts
npx playwright codegen --target=playwright-test -o tests/grabado.spec.ts https://www.saucedemo.com/

# Emular un dispositivo móvil mientras grabas
npx playwright codegen --device="iPhone 13" https://www.saucedemo.com/

# Grabar ya autenticado, reutilizando un estado de sesión guardado
npx playwright codegen --load-storage=auth.json https://www.saucedemo.com/inventory.html
```
</details>

---

## PASO 2 — Grabar tu primer flujo: login

Con el grabador abierto:

1. En el campo **Username**, haz clic y escribe `standard_user`.
2. En el campo **Password**, escribe `secret_sauce`.
3. Haz clic en el botón **Login**.
4. Observa el Inspector: debería haber generado algo como esto:

```ts
await page.goto('https://www.saucedemo.com/');
await page.getByPlaceholder('Username').click();
await page.getByPlaceholder('Username').fill('standard_user');
await page.getByPlaceholder('Password').click();
await page.getByPlaceholder('Password').fill('secret_sauce');
await page.getByRole('button', { name: 'Login' }).click();
```

5. Haz clic en el ícono de "assert" (el círculo con un check, junto al botón de grabar)
   y luego sobre el texto **"Products"** en la parte superior de la página. Codegen
   agregará una assertion automáticamente:

```ts
await expect(page.getByText('Products')).toBeVisible();
```

6. Copia ese bloque generado — lo vamos a usar en el **Paso 3**.

<div align="center">⬇️ compara con lo que ya está listo en <code>tests/00-codegen-crudo.spec.ts</code> ⬇️</div>

---

## PASO 3 — Guardar y ejecutar lo grabado

Pega el código generado dentro de un test real (ver `tests/00-codegen-crudo.spec.ts`
como referencia) y ejecútalo:

```bash
npx playwright test tests/00-codegen-crudo.spec.ts --headed
```

**Esto es intencionalmente el código "crudo"**, tal como sale del grabador — sin
organizar. En el siguiente paso lo vamos a mejorar.

---

## PASO 4 — Refinar lo grabado (de crudo a profesional)

El código de codegen es un excelente punto de partida, pero normalmente conviene:

| Problema típico del código grabado         | Cómo se soluciona                                            |
|----------------------------------------------|---------------------------------------------------------------|
| Clics duplicados (`.click()` antes de `.fill()`) | Playwright hace foco automáticamente con `.fill()`; el `.click()` previo casi siempre sobra. |
| Selectores largos o poco descriptivos        | Reemplazar por `getByTestId()` usando los atributos `data-test` que trae SauceDemo. |
| Sin nombre de test descriptivo                | Envolver en `test('nombre claro', ...)`.                     |
| Sin assertions                                | Agregar `expect()` que validen el resultado esperado.         |
| Todo en un solo archivo largo                 | Extraer a un Page Object Model reutilizable.                  |

Compara `tests/00-codegen-crudo.spec.ts` con `tests/01-login.spec.ts` para ver el
"antes y después" de este refinamiento.

<div class="tip">

💡 **Dato clave de SauceDemo**: casi todos los elementos importantes tienen un
atributo `data-test="..."` pensado exactamente para automatización. Por ejemplo,
el botón de login es `data-test="login-button"`. Siempre que codegen te dé un
selector genérico, revisa si existe un `data-test` mejor con el inspector de
elementos del navegador (clic derecho → Inspeccionar).

</div>

---

## PASO 5 — Grabar flujos más largos (agregar productos y pagar)

Repite el proceso de grabación para un flujo de compra completo:

1. Lanza de nuevo `npm run record`.
2. Haz login con `standard_user` / `secret_sauce`.
3. Agrega 2 o 3 productos al carrito (botones **"Add to cart"**).
4. Haz clic en el ícono del carrito (arriba a la derecha).
5. Haz clic en **Checkout**.
6. Completa el formulario (First Name, Last Name, Zip/Postal Code) y haz clic en
   **Continue**.
7. Revisa el resumen y haz clic en **Finish**.
8. Usa el botón de "assert" para verificar el texto **"Thank you for your order!"**.

Compara tu resultado con `tests/04-checkout-completo.spec.ts`, que ya tiene este
flujo completo, refactorizado con el Page Object Model del laboratorio.

---

## PASO 6 — Del código grabado al Page Object Model

Una vez que tienes varios tests grabados, se nota el código repetido (login, agregar
al carrito). Este laboratorio ya incluye el POM construido a partir de ese código
repetido:

- `pages/LoginPage.ts` — login, mensajes de error.
- `pages/InventoryPage.ts` — listado de productos, ordenar, agregar/quitar del carrito.
- `pages/CartPage.ts` — ver el carrito, ir a checkout.
- `pages/CheckoutPage.ts` — formulario de envío y confirmación de compra.

Revisa `tests/01-login.spec.ts` a `tests/05-logout-y-sesion.spec.ts` para ver cómo
un test grabado se transforma en un test corto y legible una vez que existe el POM.

---

## PASO 7 — Ejercicios: tu turno de grabar

Abre `tests/06-ejercicios-para-grabar.spec.ts`. Contiene **plantillas vacías** con
instrucciones en comentarios. Para cada una:

1. Lanza `npm run record`.
2. Realiza manualmente la acción descrita en el comentario.
3. Copia el código generado dentro del test correspondiente.
4. Ajusta los selectores para usar `getByTestId()` cuando sea posible.
5. Agrega al menos una `expect()` que valide el resultado.
6. Corre el test y confirma que pasa.

Los ejercicios incluyen: quitar un producto del carrito, probar el login con
`locked_out_user` y verificar el mensaje de error, cambiar el orden de productos
con el dropdown "Sort by", y cancelar un checkout a mitad de camino.

---

## PASO 8 — Ejecutar y depurar toda la suite

```bash
# Correr todos los tests
npm test

# Modo UI: ver cada paso, el DOM y viajar en el tiempo entre acciones
npm run test:ui

# Modo debug: pausa automática en cada acción con el Inspector abierto
npm run test:debug

# Ver el reporte HTML con capturas de los fallos
npm run report
```

---

## 🧭 Resumen del flujo de trabajo con Codegen

```
1. npx playwright codegen <url>     →  grabas acciones manualmente
2. Copias el código generado        →  lo pegas en un archivo .spec.ts
3. Lo ejecutas tal cual             →  confirmas que funciona
4. Lo refinas                        →  selectores estables + assertions + nombre claro
5. Extraes lo repetido a un POM     →  pages/*.ts
6. El test final queda corto        →  legible y mantenible
```

## 📚 Referencias
- Codegen: https://playwright.dev/docs/codegen
- Sitio de práctica: https://www.saucedemo.com/
