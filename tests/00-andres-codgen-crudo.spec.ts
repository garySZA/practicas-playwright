import { test, expect } from '@playwright/test';
import { log } from 'console';
import { LoginPage, USUARIOS,PASSWORD } from '../pages/LoginPage';

test('Login exitoso con standard_user', 
  async ({ page }) => {
  const loginPage = new LoginPage(page);  
  await loginPage.ir();
  await loginPage.login(
    USUARIOS.estandar, PASSWORD);
  await expect(page).toHaveURL(/inventory.html/);
});