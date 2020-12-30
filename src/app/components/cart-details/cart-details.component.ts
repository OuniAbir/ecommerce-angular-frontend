import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {

  cartItems: CartItem[] = [];
  totalQuantity: number = 0;
  totalPrice: number = 0;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {

    this.listCartDetails();
  }

  listCartDetails() {
    // get a handle of the cart items 
    this.cartItems = this.cartService.cartItems;

    // subscribe to the cart titalQuantity 
    this.cartService.totalQuantity.subscribe(
      data => {
        this.totalQuantity = data;
      }

    )

    // subscribe to the cart titalPrice 
    this.cartService.totalPrice.subscribe(
      data => {
        this.totalPrice = data;
      }
    )

    // u need to compute cart total price and quantities because u may do some changes in the cart details page 
    this.cartService.computeCartTotal();

  }

  incrementQuantity(cartItem: CartItem) {
    this.cartService.addToCart(cartItem);
  }
  DecrementQuantity(theItem: CartItem) {
    this.cartService.DecrementQuantity(theItem);

  }
  removeItems(theItem: CartItem) {
    this.cartService.removeItems(theItem);
  }
}
