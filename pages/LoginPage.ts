// ============================================================
// LoginPage: encapsula la pantalla inicial de saucedemo.com
// ============================================================
import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly inputUsuario: Locator;
  readonly inputPassword: Locator;
  readonly botonLogin: Locator;
  readonly mensajeError: Locator;

  constructor(page: Page) {
    this.page = page;
    // SauceDemo expone atributos data-test pensados para automatización
    this.inputUsuario = page.getByTestId('username');
    this.inputPassword = page.getByTestId('password');
    this.botonLogin = page.getByTestId('login-button');
    this.mensajeError = page.getByTestId('error');
  }

  async ir(): Promise<void> {
    await this.page.goto('/');
  }

  async login(usuario: string, password: string): Promise<void> {
    await this.inputUsuario.fill(usuario);
    await this.inputPassword.fill(password);
    await this.botonLogin.click();
  }

  async esperarErrorVisible(textoEsperado: string | RegExp): Promise<void> {
    await expect(this.mensajeError).toBeVisible();
    await expect(this.mensajeError).toContainText(textoEsperado);
  }
}

// Usuarios de prueba predefinidos por SauceDemo (misma password para todos)
export const USUARIOS = {
  estandar: 'standard_user',
  bloqueado: 'locked_out_user',
  conProblemas: 'problem_user',
  lento: 'performance_glitch_user',
  conErrores: 'error_user',
  visual: 'visual_user',
} as const;

export const PASSWORD = 'secret_sauce';
