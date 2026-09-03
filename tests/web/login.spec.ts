import { test, expect } from '@playwright/test';
import { LoginPage, PASSWORD, USUARIOS } from './pages/LoginPage';

test('Login exitoso con standard_user', 
    async ({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.go();
        await loginPage.login(USUARIOS.standard, PASSWORD);

        await expect(page).toHaveURL(/inventory.html/);
    }
);