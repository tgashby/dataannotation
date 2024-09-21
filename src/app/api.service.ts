import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'http://localhost:3000'; // Replace with your backend URL

  constructor(private http: HttpClient) { }

  getProducts(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/products`);
  }

  updateQuantity(productId: number, newQuantity: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/products/${productId}/quantity`, { quantity: newQuantity });
  }

  createShoppingCart(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/shopping-carts`, {});
  }
  
  createOrder(cartId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/orders`, { cart_id: cartId });
  }

  getCartItems(cartId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/shopping-carts/${cartId}/items`);
  }
  
  addToCart(cartId: number, productId: number, quantity: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/shopping-carts/${cartId}/items`, { product_id: productId, quantity });
  }
  
  removeFromCart(cartId: number, productId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/shopping-carts/${cartId}/items/${productId}`);
  }

}
