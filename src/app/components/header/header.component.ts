import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/product.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  totalCart = 0;

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit() {
    this.productService.cartCount$.subscribe((count) => {
      this.totalCart = count;
    });
  }

  handleCart() {
    this.router.navigateByUrl('/carts');
    console.log('cart');
  }
}
