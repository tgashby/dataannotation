import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ShoppingCartComponent } from '../shopping-cart/shopping-cart.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    HttpClientModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule
  ],
})
export class ProductListComponent implements OnInit {

  cartId: number = 0;
  products: any[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getProducts().subscribe((data) => {
      this.products = data;
    });
    this.createShoppingCart();
  }

  updateQuantity(productId: number, newQuantity: number) {
    this.apiService.updateQuantity(productId, newQuantity).subscribe(() => {
      this.ngOnInit();
    });
  }

  createShoppingCart() {
    this.apiService.createShoppingCart().subscribe((data) => {
      this.cartId = data.id;
    });
  }

  addToCart(productId: number, quantity: number) {
    this.apiService.addToCart(this.cartId, productId, quantity).subscribe(() => {
      // Optionally, you can refresh the cart items or provide feedback to the user
    });
  }

}