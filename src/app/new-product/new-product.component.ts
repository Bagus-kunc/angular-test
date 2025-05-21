import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.scss'],
})
export class NewProductComponent implements OnInit {
  productForm: FormGroup;
  loading = false;
  submitted = false;
  errorMessage = '';
  successMessage = '';

  categories = [
    'smartphones',
    'laptops',
    'fragrances',
    'skincare',
    'groceries',
    'home-decoration',
    'furniture',
    'tops',
    'womens-dresses',
    'womens-shoes',
    'mens-shirts',
    'mens-shoes',
    'mens-watches',
    'womens-watches',
    'womens-bags',
    'womens-jewellery',
    'sunglasses',
    'automotive',
    'motorcycle',
    'lighting',
  ];

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private router: Router
  ) {
    this.productForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: ['', [Validators.required, Validators.min(1)]],
      discountPercentage: ['', [Validators.min(0), Validators.max(99)]],
      rating: ['', [Validators.min(0), Validators.max(5)]],
      stock: ['', [Validators.required, Validators.min(0)]],
      brand: ['', Validators.required],
      category: ['', Validators.required],
      thumbnail: ['', [Validators.required, Validators.pattern('https?://.+')]],
      images: [''],
    });
  }

  ngOnInit(): void {}

  get f() {
    return this.productForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.productForm.invalid) {
      return;
    }

    // Siapkan data produk
    const productData = {
      ...this.productForm.value,
    };

    if (productData.images) {
      productData.images = productData.images
        .split(',')
        .map((url: string) => url.trim())
        .filter((url: string) => url !== '');
    } else {
      productData.images = [];
    }

    this.loading = true;
    this.productService.addProduct(productData).subscribe({
      next: (response) => {
        this.loading = false;
        this.successMessage = 'Produk berhasil ditambahkan!';

        this.productForm.reset();
        this.submitted = false;

        setTimeout(() => {
          this.router.navigate(['/product', response.id]);
        }, 2000);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Terjadi kesalahan saat menambahkan produk.';
        console.error('Add product error:', error);
      },
    });
  }
}
