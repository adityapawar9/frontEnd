import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { AppComponent } from '../../../app.component';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']  // Corrected styleUrls
})
export class CategoryComponent {
  @Input() catList: any[] = [];  // Input to receive the list of categories
  isTrue: boolean = true;        // Determines whether the category list is displayed
  isAddCategory: boolean = false;  // Determines whether the "Add Category" form is displayed
  name: string = '';             // Holds the name of the new category

  constructor(public http: HttpClient, public app: AppComponent) { }

  ngOnInit(): void {
    this.loadCategories();  // Load categories when the component initializes
  }

  // Switch to the category list view
  categoryChange() {
    this.isTrue = true;
    this.isAddCategory = false;
  }

  // Switch to the add category view
  addCategoryChange() {
    this.isAddCategory = true;
    // this.isTrue = false;
  }

  // Load all categories from the server
  loadCategories(): void {
    const url = this.app.baseUrl + 'admin/getAllCategories';
    this.http.get<any[]>(url).subscribe(data => {
      if (data == null) {
        window.alert('Something is wrong');
      } else {
        this.catList = data;  // Update category list
      }
    });
  }

  // Add a new category to the server
  addCategory(): void {
    if (!this.name.trim()) {
      window.alert('Please enter a category name');
      return;
    }
    const url = `${this.app.baseUrl}admin/addNewCategory${this.app.id}`;
    this.http.post(url, this.name).subscribe(data => {
      if (data == null) {
        window.alert('Something is wrong');
      } else {
        // console.log(url);
        this.catList.push(data);  // Add the new category to the list
        this.name = '';           // Clear the input after adding
        this.categoryChange();    // Switch back to category list view
      }
    });
  }

  // Delete a category from the server
  deleteCategory(id: number): void {
    if (window.confirm('Are you sure you want to delete this category?')) {
      const url = `${this.app.baseUrl}admin/deleteCategory/${id}`;
      this.http.delete(url).subscribe(() => {
        this.loadCategories();  // Reload categories after deletion
      });
    }
  }
  resetForm() {
    this.isAddCategory = false;
    // this.isTrue = false;
    this.name = ''; // Clear input field
  }

}
