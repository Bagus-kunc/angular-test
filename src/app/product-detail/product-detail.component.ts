import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { switchMap } from 'rxjs/operators';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit {
  product: any = null;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const id = params.get('id');
          this.loading = true;
          return this.productService.getProductById(id);
        })
      )
      .subscribe({
        next: (data) => {
          this.product = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Gagal mengambil detail produk';
          this.loading = false;
          console.error('Error:', err);
        },
      });
  }

  addToCart(product: any): void {
    const cartItems = this.productService.getCartItems();

    const isExist = cartItems.some((item) => item === product);

    if (isExist) {
      return;
    }

    this.productService.addToCart(product);
  }

  isInCart(product: any): boolean {
    const cartItems = this.productService.getCartItems();
    return cartItems.some((item) => item === product);
  }
}
