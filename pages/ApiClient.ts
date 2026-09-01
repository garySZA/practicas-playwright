// ============================================================
// ApiClient: encapsula las llamadas a una API externa, siguiendo
// el mismo patrón que los Page Objects de la carpeta pages/.
//
// SauceDemo es un sitio estático: no expone una API REST propia
// para el catálogo o el carrito. Para practicar API testing con
// datos reales, este cliente usa JSONPlaceholder (una API pública
// gratuita, pensada exactamente para practicar), y combina esos
// datos con el flujo de UI de SauceDemo (ver tests/07-api-testing.spec.ts).
// ============================================================
import { APIRequestContext, APIResponse } from '@playwright/test';

export interface UsuarioAPI {
  id: number;
  name: string;
  username: string;
  email: string;
}

export interface PostAPI {
  id?: number;
  title: string;
  body: string;
  userId: number;
}

export class ApiClient {
  readonly request: APIRequestContext;
  readonly baseURL = 'https://jsonplaceholder.typicode.com';

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async obtenerUsuario(id: number): Promise<UsuarioAPI> {
    const respuesta: APIResponse = await this.request.get(`${this.baseURL}/users/${id}`);
    if (!respuesta.ok()) {
      throw new Error(`No se pudo obtener el usuario ${id}: status ${respuesta.status()}`);
    }
    return respuesta.json();
  }

  async crearPost(post: PostAPI): Promise<PostAPI> {
    const respuesta: APIResponse = await this.request.post(`${this.baseURL}/posts`, {
      data: post,
    });
    if (respuesta.status() !== 201) {
      throw new Error(`No se pudo crear el post: status ${respuesta.status()}`);
    }
    return respuesta.json();
  }

  async eliminarPost(id: number): Promise<APIResponse> {
    return this.request.delete(`${this.baseURL}/posts/${id}`);
  }
}
