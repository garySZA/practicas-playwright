// ============================================================
// CartPage: encapsula la página del carrito (/cart.html)
// ============================================================
import { Page, Locator } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly items: Locator;
  readonly botonCheckout: Locator;
  readonly botonSeguirComprando: Locator;

  constructor(page: Page) {
    this.page = page;
    this.items = page.locator('.cart_item');
    this.botonCheckout = page.getByTestId('checkout');
    this.botonSeguirComprando = page.getByTestId('continue-shopping');
  }

  itemPorNombre(nombre: string): Locator {
    return this.items.filter({ hasText: nombre });
  }

  async quitarProducto(nombre: string): Promise<void> {
    await this.itemPorNombre(nombre).getByRole('button', { name: 'Remove' }).click();
  }

  async irACheckout(): Promise<void> {
    await this.botonCheckout.click();
  }

  async seguirComprando(): Promise<void> {
    await this.botonSeguirComprando.click();
  }
}
