import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-status',
  templateUrl: './cart-status.component.html',
  styleUrls: ['./cart-status.component.css']
})
export class CartStatusComponent implements OnInit {

  totalPrice : number  = 0 ;
  totalQuantity : number = 0;
  constructor(private cartServie : CartService) { }

  ngOnInit(): void {
    this.updatetheCartStatus() ;
  }

  updatetheCartStatus(){
    this.cartServie.totalQuantity.subscribe(
      data => {
        this.totalQuantity = data ;
      }
    )
    this.cartServie.totalPrice.subscribe(
      data => {
        this.totalPrice = data ;
      }
    )

  }
}
