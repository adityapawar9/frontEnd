import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.css']
})
export class ManagementComponent {

  whatToShow: number = 0;  // Controls which section is visible
  products: any;    // Array to hold product data
  categories: any[] = [];  // Array to hold category data
  orders: any;             // Array or object to hold order data
  name: string = '';       // User's name
  isTrue: boolean = false;
  isAddCatagory: boolean = false;
  catList: any;

  constructor(public http: HttpClient, public app: AppComponent) {
    this.loadUserName();  // Load the user's name when component initializes
  }

  // Load the user's name from the server
  loadUserName() {
    const url = `${this.app.baseUrl}login/getName${this.app.id}`;
    this.http.get(url).subscribe((data: any) => {
      if (data == null) {
        window.alert('Something is wrong');
      } else {
        this.name = data[0];  // Assuming data[0] contains the name
      }
    });
  }

  // Function to handle section switching
  changeWhatToShow(num: number) {
    this.whatToShow = num;  // Change the currently visible section
    if (this.whatToShow === 1) {
      this.loadProduct();  // Load products when the "Products" section is selected
    } else if (this.whatToShow === 0) {
      this.loadCategories();
    }
  }

  // Fetch products from the server
  loadProduct() {
    const url = `${this.app.baseUrl}seller/getAllProducts${this.app.id}`;
    this.http.get(url).subscribe(data => {
      if (data == null) {
        window.alert('Something is wrong');
      } else {
        this.products = data;
        // Parse image URLs if they are stored as strings
        this.products.forEach((product: any) => {
          if (typeof product.imageUrls === 'string') {
            product.imageUrls = JSON.parse(product.imageUrls);
          }
        });
      }
      console.log(this.products);

    });
  }

  // Sort and load orders by status (Active, Pending, Resolved)
  sort(status: number) {
    const url = `${this.app.baseUrl}seller/sortWithStatus${status}`;
    this.http.get(url).subscribe(
      data => {
        if (data == null) {
          window.alert('Something is wrong');
        } else {
          this.orders = data;
          this.changeWhatToShow(2);  // Show orders when sorted
        }
      },
      error => {
        console.error('There was an error!', error);
        window.alert('Failed to fetch orders');
      }
    );
  }

  categoryChange() {
    this.isTrue = true;
    this.isAddCatagory = false;
  }
  addCategoryChange() {
    this.isAddCatagory = true;
    this.isTrue = false
  }
  loadCategories(): void {
    const url = this.app.baseUrl + 'admin/getAllCategories';
    this.http.get<any>(url).subscribe(data => {
      if (data == null) {
        window.alert('Something is Wrong');
      } else {
        this.catList = data;
      }
    });
  }

  addCategory(): void {
    if (!this.name.trim()) {
      window.alert('Please enter a category');
      return;
    }
    const url = `${this.app.baseUrl}admin/addNewCategory${this.app.id}`;
    this.http.post<any>(url, { name: this.name }).subscribe(data => {
      if (data == null) {
        window.alert('Something is wrong');
      } else {
        this.catList.push(data);  // Assuming data contains the new category
        this.name = '';  // Clear the input after adding
      }
    });
  }

  deleteCategory(id: number): void {
    if (window.confirm('Are you sure you want to delete this category?')) {
      const url = `${this.app.baseUrl}admin/deleteCategory/${id}`;
      this.http.delete(url).subscribe(() => {
        this.loadCategories();  // Reload categories after deletion
      });
    }
  }
}