import { Component, Inject, OnInit, inject, OnDestroy } from '@angular/core';
import { Product } from '../../../../../models/products/product';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../../../../../services/products/product.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { CategoryService } from '../../../../../services/categories/category.service';
import { Category } from '../../../../../models/category/category';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-component',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSelectModule
  ],
  providers:[
    CategoryService,
    ProductService
  ],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.sass'
})

export class EditProductComponent implements OnInit, OnDestroy{
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  private destroy$ = new Subject<void>;
  public productsData = this.data;
  public produtoId = this.data.produtoId;
  public produto = this.data.produto;
  public categoriesData!: Array<Category>;
  private productService = inject(ProductService);
  private categoriaService = inject(CategoryService);
  private formBuilder = inject(FormBuilder);
  private routerService = inject(Router);
  private dialogService = inject(MatDialog);

  ngOnInit(): void {
    this.getAllCategories();
    this.getAllProducts();
  }

  editProductForm = this.formBuilder.group({
    nomeProduto: this.produto.nomeProduto,
    descricaoProduto: this.produto.descricaoProduto,
    categoriaId: this.produto.categoriaId,
    precoProduto: this.produto.precoProduto,
    quantidadeProduto: this.produto.quantidadeProduto,
  })

  getAllCategories(): void{
    this.categoriaService.getAllCategory().pipe(
      takeUntil(
        this.destroy$
        )
        ).subscribe({
          next: (response) => {
          console.log(response)
        this.categoriesData = response;
      },
      error: (err) => {
      console.log(err)
      }
    })
  }

  getAllProducts(): void{
    this.productService.getAllProducts().pipe(
      takeUntil(
        this.destroy$
      )
    ).subscribe({
      next: (response) =>{
        this.productsData = response;
      },
      error: (err) => {
      console.log(err)
      }
    })
  }

  putProduct(): void{
    this.productService.putProduct(this.produtoId, this.editProductForm.value as Product).pipe(
      takeUntil(
        this.destroy$
      )
    ).subscribe(() => {
      this.recarregarPagina();
      this.dialogService.closeAll();
    }
    );
  }

  recarregarPagina(){
    window.location.reload();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}