import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class ShoppingCartComponent implements OnInit {

  cartId: number = 0;
  products: any[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.createShoppingCart();
  }
  
  createShoppingCart() {
    this.apiService.createShoppingCart().subscribe((data) => {
      this.cartId = data.id;
      this.loadCartItems();
    });
  }

  loadCartItems() {
    this.apiService.getCartItems(this.cartId).subscribe((data) => {
      this.products = data;
    });
  }

  addToCart(productId: number, quantity: number) {
    this.apiService.addToCart(this.cartId, productId, quantity).subscribe(() => {
      this.loadCartItems();
    });
  }

  removeFromCart(productId: number) {
    this.apiService.removeFromCart(this.cartId, productId).subscribe(() => {
      this.loadCartItems();
    });
  }

  createOrder() {
    this.apiService.createOrder(this.cartId).subscribe(() => {
      this.createShoppingCart();
    });
  }

}