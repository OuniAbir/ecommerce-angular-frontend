import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  constructor(private productService: ProductService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      ()=> {  this.getProducts(); }
    );  }
  getProducts() {

    //  check if "id" parameter is availabel
    const hasCotegoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCotegoryId) {
       this.currentCategoryId = + this.route.snapshot.paramMap.get('id');

    } else {
      // not category id is available ... default is 1
      this.currentCategoryId = 1;
    }

    this.previousCategoryId = this.currentCategoryId;
    console.log(` category is ${this.currentCategoryId}`);
    this.productService.getProductList(this.currentCategoryId).subscribe(
      data => {
        this.products = data;
      }
    );

  };

}
