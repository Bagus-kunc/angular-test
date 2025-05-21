import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  thumbnail: string;
  images: string[];
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private productsUrl = 'https://dummyjson.com/products';

  private cartItems: Number[] = [];
  private cartCountSubject = new BehaviorSubject<number>(0);
  public cartCount$: Observable<number> = this.cartCountSubject.asObservable();

  constructor(private http: HttpClient) {}

  getProducts(): Observable<ProductsResponse> {
    return this.http.get<ProductsResponse>(this.productsUrl).pipe(
      tap((_) => console.log('fetched products')),
      catchError(this.handleError<ProductsResponse>('getProducts'))
    );
  }

  getProductById(id: string | null): Observable<Product> {
    if (!id) {
      return throwError(() => new Error('Invalid product id'));
    }
    return this.http.get<Product>(`${this.productsUrl}/${id}`).pipe(
      tap(() => console.log(`fetched product id=${id}`)),
      catchError(this.handleError<Product>(`getProductById id=${id}`))
    );
  }

  addProduct(productData: any): Observable<any> {
    return this.http.post(`${this.productsUrl}/add`, productData).pipe(
      tap((_) => console.log('added product')),
      catchError(this.handleError<any>('addProduct'))
    );
  }

  addToCart(product: any): void {
    this.cartItems.push(product);
    this.cartCountSubject.next(this.cartItems.length);
  }

  getCartItems(): Number[] {
    return this.cartItems;
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
