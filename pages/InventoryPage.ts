// ============================================================
// InventoryPage: encapsula la página de productos (/inventory.html)
// ============================================================
import { Page, Locator } from '@playwright/test';

export type OrdenProductos =
  | 'az'   // Name (A to Z)
  | 'za'   // Name (Z to A)
  | 'lohi' // Price (low to high)
  | 'hilo'; // Price (high to low)

export class InventoryPage {
  readonly page: Page;
  readonly titulo: Locator;
  readonly productos: Locator;
  readonly selectorOrden: Locator;
  readonly iconoCarrito: Locator;
  readonly contadorCarrito: Locator;
  readonly menuHamburguesa: Locator;
  readonly linkLogout: Locator;

  constructor(page: Page) {
    this.page = page;
    this.titulo = page.getByText('Products', { exact: true });
    this.productos = page.locator('.inventory_item');
    this.selectorOrden = page.getByTestId('product-sort-container');
    this.iconoCarrito = page.getByTestId('shopping-cart-link');
    this.contadorCarrito = page.getByTestId('shopping-cart-badge');
    this.menuHamburguesa = page.getByRole('button', { name: 'Open Menu' });
    this.linkLogout = page.getByTestId('logout-sidebar-link');
  }

  productoPorNombre(nombre: string): Locator {
    return this.productos.filter({ hasText: nombre });
  }

  async agregarAlCarrito(nombreProducto: string): Promise<void> {
    const producto = this.productoPorNombre(nombreProducto);
    await producto.getByRole('button', { name: 'Add to cart' }).click();
  }

  async quitarDelCarrito(nombreProducto: string): Promise<void> {
    const producto = this.productoPorNombre(nombreProducto);
    await producto.getByRole('button', { name: 'Remove' }).click();
  }

  async ordenarPor(orden: OrdenProductos): Promise<void> {
    await this.selectorOrden.selectOption(orden);
  }

  async irAlCarrito(): Promise<void> {
    await this.iconoCarrito.click();
  }

  async cerrarSesion(): Promise<void> {
    await this.menuHamburguesa.click();
    await this.linkLogout.click();
  }

  async obtenerPrecios(): Promise<number[]> {
    const textos = await this.page.locator('.inventory_item_price').allTextContents();
    return textos.map((t) => parseFloat(t.replace('$', '')));
  }

  async obtenerNombres(): Promise<string[]> {
    return this.page.locator('.inventory_item_name').allTextContents();
  }
}
