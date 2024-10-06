import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {

  categories: any;
  products: any = [];
  catid: number = 0; // Default to 0 to load all products
  minprice: number = 0;
  maxprice: number = 200000;
  minrating: number = 0;
  cartItems: any = [];
  rating: number = 0;
  imageUrls: any = [];
  showCart: boolean = false;
  orders: any[] = [];
  totalAmount: number = 0;
  quantity: number = 0;

  // Pagination properties
  paginatedProducts: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 8;
  totalPages: number = 1;
  pages: number[] = [];

  newQuantity: number = 0;
  afterDiscountPrice: number = 0;

  isLoading: boolean = false;


  
  constructor(private http: HttpClient, private app: AppComponent, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.loadCategories();
    this.loadProduct();
  }

  loadCategories(): void {
    const url = `${this.app.baseUrl}admin/getAllCategories`;
    this.http.get(url).subscribe({
      next: (data: any) => this.categories = data,
      error: () => window.alert('Something went wrong while loading categories.')
    });
  }

  getSanitizedUrl(imageUrl: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
  }

  loadProduct(): void {
    this.isLoading = true;
    const obj = [this.catid, this.minprice, this.maxprice, this.minrating];
    // console.log(obj);

    let url = `${this.app.baseUrl}buyer/getProductsBuyer`;

    if (this.catid == 0) {
      url = `${this.app.baseUrl}buyer/getAllProducts`;
    }
    // console.log(url);

    this.http.post(url, obj).subscribe({
      next: (data: any) => {
        if (data && data.length > 0) {
          this.products = data;
          // console.log(this.products);
          this.products.forEach((product: any) => {
            if (typeof product.imageUrls === 'string') {
              product.imageUrls = JSON.parse(product.imageUrls);
            }
          });
          // console.log(this.products);

        } else {
          window.alert('No products found with the given criteria.');
        }
        this.isLoading = false;
      },
      error: () => {
        window.alert('Something went wrong while loading products.');
        this.isLoading = false;
      }
    });
  }

  printRating(p: any): void {
    if (p.ratingChange !== 0) {
      const url = `${this.app.baseUrl}buyer/giveRatingToProduct/${p.id}/${this.app.id}/${p.ratingChange}`;
      this.http.get(url).subscribe({
        next: (data: any) => {
          if (data) {
            window.alert('Rating updated successfully.');
          } else {
            window.alert('Something went wrong while updating the rating.');
          }
        },
        error: () => window.alert('Something went wrong while updating the rating.')
      });
    }
  }

  addToCart(p: any): void {
    this.isLoading = true;
    const url = `${this.app.baseUrl}buyer/addToCart/${p.id}/${this.app.id}`;
    this.http.get(url).subscribe({
      next: (data: any) => {
        // console.log(data);

        if (data === 1) {
          window.alert('Already added in the cart.');
        } else if (data === 2) {
          window.alert('Added to cart successfully.');
          this.loadCartProducts();
        } else {
          window.alert('Something went wrong while adding to the cart.');
        }
        this.isLoading = false;
      },
      error: () => {
        window.alert('Something went wrong while adding to the cart.');
        this.isLoading = false;
      }
    });
  }
  removeItemFromCart(productId: number): void {
    this.isLoading = true;
    const url = `${this.app.baseUrl}buyer/removeFromCart/${productId}/${this.app.id}`;
    // console.log(url);

    this.http.delete(url).subscribe({
      next: (data: any) => {
        // console.log(data);

        if (data === 1) {
          window.alert('Item removed successfully.');
          this.loadCartProducts(); // Reload cart products after removal
        } else {
          window.alert('Failed to remove the item.');
        }
        this.isLoading = false;
      },
      error: () => {
        window.alert('Something went wrong while removing the item.');
        this.isLoading = false;
      }
    });
  }

  loadCartProducts(): void {
    this.isLoading = true;
    const url = `${this.app.baseUrl}buyer/getCartProducts/${this.app.id}`;
    this.http.get(url).subscribe({
      next: (data: any) => {
        // console.log(data);
        if (!data || data.length === 0) {
          window.alert('Cart is empty.');
          this.showCart = false;
        } else {
          this.cartItems = data;
          // console.log(this.cartItems.imageUrl);
          this.cartItems.forEach((cartItems: any) => {
            if (typeof cartItems.imageUrls === 'string') {
              cartItems.imageUrls = JSON.parse(cartItems.imageUrls);
            }
          });
          // console.log(this.cartItems);

          this.updateTotalAmount();
          this.showCart = true;
          window.alert('Cart loaded successfully.');
        }
        this.isLoading = false;
      },
      error: () => {
        window.alert('Something went wrong while loading the cart.');
        this.isLoading = false;
      }
    });
  }

  placeOrder(): void {
    this.isLoading = true;
    const prodIds = this.cartItems.map((item: any) => item.id);
    const url = `${this.app.baseUrl}buyer/placeOrder/${this.app.id}/${this.totalAmount}`;
    this.http.post(url, prodIds).subscribe({
      next: (response: any) => {
        console.log(response);
        if (response === 1) {
          this.cartItems = [];
          this.showCart = false;
          window.alert('Order placed successfully.');
        } else {
          window.alert('Something went wrong while placing the order.');
        }
        this.isLoading = false;
      },
      error: () => {
        window.alert('Something went wrong while placing the order.');
        this.isLoading = false;
      }
    });
  }

  updateTotalAmount(): void {
    this.totalAmount = this.cartItems.reduce((sum: number, item: { newQuantity: number; }) => {
      this.newQuantity = item.newQuantity && !isNaN(item.newQuantity) && item.newQuantity > 0 ? item.newQuantity : 1;
      return sum + this.calculateDiscountedAmount(item) * this.newQuantity;
    }, 0);
  }

  calculateDiscountedAmount(item: any): number {
    if (item.newQuantity > item.quantity) {
      window.alert(`Only ${item.quantity} ${item.name} available in stock.`);
      item.newQuantity = 1; // Reset to a valid value
      return 0;
    }
    const discount = item.discount || 0;
    this.afterDiscountPrice = item.price * (1 - discount / 100);
    return this.afterDiscountPrice;
  }

  handleQuantityChange(item: any): void {
    if (isNaN(item.newQuantity) || item.newQuantity <= 0) {
      window.alert('Invalid quantity entered. Setting to 1.');
      item.newQuantity = 1; // Reset to a default value
    }
    this.updateTotalAmount();
  }
}