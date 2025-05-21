import { Component } from '@angular/core';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-carts',
  templateUrl: './carts.component.html',
  styleUrls: ['./carts.component.scss'],
})
export class CartsComponent {
  items = ['Apple', 'Banana', 'Cherry'];
  products: any[] = [];
  errorMessage = '';
  isLoading = false;
  newItem = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.isLoading = true;

    this.productService.getProducts().subscribe({
      next: (response) => {
        const cartItemIds = this.productService.getCartItems();
        this.products = response.products.filter((product) =>
          cartItemIds.includes(product.id)
        );

        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Gagal memuat produk.';
        console.error(err);
      },
    });
  }

  addItem() {
    if (this.newItem) {
      this.items.push(this.newItem);
      this.newItem = '';
    }
  }
}
