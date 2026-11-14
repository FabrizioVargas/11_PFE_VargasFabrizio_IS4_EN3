import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

interface Product {
  id: number;
  name: string;
  code: string;
  category: string;
  stock: number;
  price: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  products: Product[] = [
    { id: 1, name: 'Mouse inalámbrico', code: 'TEC-001', category: 'Tecnología', stock: 15, price: 29.99 },
  ];

  editingId: number | null = null;
  message = '';

  productForm;

  constructor(private formBuilder: FormBuilder) {
    this.productForm = this.formBuilder.nonNullable.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      code: ['', Validators.required],
      category: ['Tecnología', Validators.required],
      stock: [1, [Validators.required, Validators.min(0)]],
      price: [0, [Validators.required, Validators.min(0.01)]],
    });
  }

  saveProduct(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const product = this.productForm.getRawValue();
    if (this.editingId === null) {
      this.products.push({ ...product, id: Date.now() });
      this.message = 'Producto registrado correctamente.';
    } else {
      this.products = this.products.map((item) =>
        item.id === this.editingId ? { ...product, id: item.id } : item,
      );
      this.message = 'Producto actualizado correctamente.';
    }

    this.cancelEdit();
    setTimeout(() => (this.message = ''), 2500);
  }

  editProduct(product: Product): void {
    this.editingId = product.id;
    this.productForm.setValue({
      name: product.name,
      code: product.code,
      category: product.category,
      stock: product.stock,
      price: product.price,
    });
  }

  deleteProduct(id: number): void {
    this.products = this.products.filter((product) => product.id !== id);
  }

  cancelEdit(): void {
    this.editingId = null;
    this.productForm.reset({ name: '', code: '', category: 'Tecnología', stock: 1, price: 0 });
  }

  invalid(field: string): boolean {
    const control = this.productForm.get(field);
    return !!control && control.invalid && control.touched;
  }
}
