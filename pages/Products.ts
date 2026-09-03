import { Page, Locator } from '@playwright/test';

export type OrdenProductos =
    | 'az'
    | 'za'
    | 'lohi'
    | 'hilo';

export class ProductsPage {
    readonly productos: Locator;
    readonly iconoCarrito: Locator;
    readonly menuHamburguesa: Locator;
    readonly botonCerrarSesion: Locator;
    readonly selectorOrden: Locator;

    constructor (page: Page) {
        this.productos = page.getByTestId('inventory-item');
        this.iconoCarrito = page.getByTestId('shopping-cart-link');
        this.menuHamburguesa = page.getByRole('button', {name: 'Open Menu'});
        this.botonCerrarSesion = page.getByTestId('logout-sidebar-link');
        this.selectorOrden = page.getByTestId('product-sort-container');
    }

    buscarProductoPorNombre(nombre: string): Locator{
        return this.productos.filter({ hasText: nombre });
    }

    async agregarProducto(nombre: string): Promise<void> {
        const producto = this.buscarProductoPorNombre(nombre);

        await producto.getByRole('button', { name: 'Add to cart' }).click();
    }

    async quitarProducto(nombre: string): Promise<void> {
        const producto = this.buscarProductoPorNombre(nombre);

        await producto.getByRole('button', { name: 'Remove' }).click();
    }

    async irACarrito(): Promise<void> {
        await this.iconoCarrito.click();
    }

    async cerrarSesion(): Promise<void> {
        this.menuHamburguesa.click();

        this.botonCerrarSesion.click();
    }

    async ordenarPor(orden: OrdenProductos): Promise<void>{
        await this.selectorOrden.selectOption(orden);
    }
}