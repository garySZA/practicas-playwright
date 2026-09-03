import { test as base } from '@playwright/test';
import { LoginPage } from '../../tests/web/pages/LoginPage';


/**
 * Fixtures personalizados que extienden el test base de Playwright con
 * objetos reutilizables:
 * - page objects para pruebas de Web UI
 * - un cliente de API para pruebas de API
 *
 * Importa { test, expect } desde este módulo en lugar de '@playwright/test'
 * para que estos fixtures se inyecten automáticamente.
 */
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type Fixtures = {
    loginPage: LoginPage;

};

export const test = base.extend<Fixtures>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    }
});

export { expect } from '@playwright/test';
