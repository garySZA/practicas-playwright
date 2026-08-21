// ============================================================
// CheckoutPage: encapsula los 3 pasos del checkout de SauceDemo
// (información -> resumen -> confirmación)
// ============================================================
import { Page, Locator } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;

  // Paso uno: datos del comprador
  readonly inputNombre: Locator;
  readonly inputApellido: Locator;
  readonly inputCodigoPostal: Locator;
  readonly botonContinuar: Locator;
  readonly mensajeError: Locator;

  // Paso dos: resumen
  readonly resumenTotal: Locator;
  readonly botonFinalizar: Locator;
  readonly botonCancelar: Locator;

  // Paso tres: confirmación
  readonly mensajeConfirmacion: Locator;

  constructor(page: Page) {
    this.page = page;

    this.inputNombre = page.getByTestId('firstName');
    this.inputApellido = page.getByTestId('lastName');
    this.inputCodigoPostal = page.getByTestId('postalCode');
    this.botonContinuar = page.getByTestId('continue');
    this.mensajeError = page.getByTestId('error');

    this.resumenTotal = page.getByTestId('total-label');
    this.botonFinalizar = page.getByTestId('finish');
    this.botonCancelar = page.getByTestId('cancel');

    this.mensajeConfirmacion = page.getByText('Thank you for your order!');
  }

  async completarDatos(nombre: string, apellido: string, codigoPostal: string): Promise<void> {
    await this.inputNombre.fill(nombre);
    await this.inputApellido.fill(apellido);
    await this.inputCodigoPostal.fill(codigoPostal);
    await this.botonContinuar.click();
  }

  async finalizarCompra(): Promise<void> {
    await this.botonFinalizar.click();
  }

  async cancelar(): Promise<void> {
    await this.botonCancelar.click();
  }
}
