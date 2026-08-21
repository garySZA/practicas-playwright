import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly inputUser: Locator;
    readonly inputPassword: Locator;
    readonly loginButton: Locator;
    readonly errorMessage: Locator;

    constructor( page: Page ){
        this.page = page;

        this.inputUser = page.getByPlaceholder("Username");
        this.inputPassword = page.getByPlaceholder("Password");
        this.loginButton = page.getByRole('button', {name: "Login"})
        this.errorMessage = page.locator('[data-test="login-button"]');

    }

    async go(): Promise<void> {
        await this.page.goto('/');
    }

    async login(user: string, password: string): Promise<void> {
        await this.inputUser.fill(user);
        await this.inputPassword.fill(password);

        await this.loginButton.click();
    }

    async esperarErrorVisible(textoEsperado: string | RegExp): Promise<void> {
        await expect(this.errorMessage).toBeVisible();
        await expect(this.errorMessage).toContainText(textoEsperado);
    }
}

export const USUARIOS = {
    standard: 'standard_user',
    bloqueado: 'locked_out_user',
    conProblemas: 'problem_user',
    lento: 'performance_glitch_user',
    conErrores: 'error_user',
    visual: 'visual_user',
} as const;

export const PASSWORD = 'secret_sauce';