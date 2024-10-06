import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { AppComponent } from '../../../app.component';
import { ManagementComponent } from '../management.component';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit {
  @Input() products: any[] = []; // All Products
  @Input() categories: any = []; // All Categories

  id: number = 0;
  name: string = '';
  price: number = 0;
  quantity: number = 0;
  description: string = '';
  discount: number = 0;
  catid: number = 0;
  imageUrls: string[] = []; // Array of image URLs for the product

  activeSlideIndex: number[] = []; // Track active slide for each product
  selectedIndex = 0;
  indecator = true;

  editMode: boolean = false;

  constructor(public http: HttpClient, public app: AppComponent, public comp: ManagementComponent,
    private fireStorage: AngularFireStorage, private sanitizer: DomSanitizer) { }

    ngOnInit(): void {
      this.loadCategories();
      // Initialize activeSlideIndex only if products array is defined and not empty
      if (this.products && Array.isArray(this.products)) {
        this.activeSlideIndex = this.products.map(() => 0); // Initialize active slide indexes
      }
      console.log(this.products);
    }
    

  getSanitizedUrl(imageUrl: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
  }
  changeSlide(productIndex: number, direction: number): void {
    const product = this.products[productIndex];
    const totalSlides = product.imageUrls.length;

    // Update the active slide index
    this.activeSlideIndex[productIndex] = (this.activeSlideIndex[productIndex] + direction + totalSlides) % totalSlides;
  }
  loadCategories() {
    const url = `${this.app.baseUrl}admin/getAllCategories`;
    this.http.get(url).subscribe(data => {
      if (data == null) {
        window.alert('Something is wrong');
      } else {
        this.categories = data;
      }
    });
  }

  async onFileChange(event: any) {
    const selectedFiles = event.target.files;
    if (selectedFiles.length > 0) {
      this.imageUrls = []; // Reset image URLs
      for (let file of selectedFiles) {
        const path = `ProductImages/${file.name}`;
        try {
          const uploadTask = await this.fireStorage.upload(path, file);
          const url = await uploadTask.ref.getDownloadURL();
          this.imageUrls.push(url); // Add the URL to the product's imageUrls array
        } catch (error) {
          console.error("Upload failed:", error);
          window.alert("Failed to upload the image. Please try again.");
        }
      }
    }
  }

  deleteFile(imageUrls: string) {
    const fileRef = this.fireStorage.refFromURL(imageUrls);
    fileRef.delete().subscribe({
      next: () => console.log('File deleted successfully'),
      error: (error) => console.error('Error deleting file:', error)
    });
  }
  onDelete(product: any) {
    if (window.confirm('Are you sure you want to delete this Product?')) {
      const url = `${this.app.baseUrl}seller/deleteProduct/${product.id}`;
      this.http.delete(url).subscribe(response => {
        if (response) {
          product.imageUrls.forEach((url: string) => this.deleteFile(url));
          this.comp.loadProduct();
          alert("Product deleted successfully");
        } else {
          alert("Something went wrong");
        }
      });
    }
  }
  addProduct() {
    if (!this.name.trim() || this.price === 0 || this.quantity === 0 || this.discount === 0 || !this.description.trim() || !Array.isArray(this.imageUrls) || this.imageUrls.length === 0) {
      window.alert('All fields, including at least one image URL, are mandatory');
      return;
    }
    const product = {
      id: this.id,
      name: this.name.trim(),
      userid: this.app.id,
      price: this.price,
      quantity: this.quantity,
      description: this.description.trim(),
      discount: this.discount,
      categoryid: this.catid,
      imageUrlsJson: this.imageUrls
    };
    const url = `${this.app.baseUrl}seller/addNewProduct`;
    this.http.post(url, product).subscribe((data: any) => {
      if (!data) {
        window.alert('Something went wrong');
      } else {
        if (typeof data.imageUrls === 'string') {
          data.imageUrls = JSON.parse(data.imageUrls);
        }
        if (this.products) {
          this.products.push(data);
        } else {
          this.products = [data];
        }
        this.comp.loadProduct();
        this.resetForm();
      }
    });
  }

  resetForm(): void {
    this.editMode = false;
    this.id = 0;
    this.name = '';
    this.price = 0;
    this.quantity = 0;
    this.description = '';
    this.discount = 0;
    this.catid = 0;
    this.imageUrls = [];
  }

  onEdit(product: any) {
    const url = `${this.app.baseUrl}seller/getCatId/${product.catName}`;
    this.http.get(url).subscribe((data: any) => {
      if (data == null) {
        window.alert('Something went wrong');
      } else {
        this.catid = data;
      }
    });
    this.id = product.id;
    this.name = product.name;
    this.price = product.price;
    this.quantity = product.quantity;
    this.description = product.description;
    this.discount = product.discount;
    this.imageUrls = product.imageUrls;
    this.editMode = true;
  }
  updateProduct() {
    if (!this.name.trim() || this.price == 0 || this.quantity == 0 || this.discount == 0 || !this.description.trim()) {
      window.alert('All fields are mandatory');
      return;
    }

    const updatedProduct = {
      id: this.id,
      name: this.name,
      price: this.price,
      quantity: this.quantity,
      description: this.description,
      discount: this.discount,
      categoryid: this.catid,
      imageUrlsJson: this.imageUrls
    };

    const url = `${this.app.baseUrl}seller/updateProduct/${updatedProduct.id}`;
    this.http.put(url, updatedProduct).subscribe((data: any) => {
      if (data) {
        this.comp.loadProduct();
        this.resetForm();
      } else {
        window.alert('Failed to update the product.');
      }
    });
  }

}
