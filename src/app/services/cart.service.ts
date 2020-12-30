import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {
 cartItems : CartItem[] = [];
 totalPrice : Subject<number> = new Subject<number>() ;
 totalQuantity : Subject<number> = new Subject<number>();

  constructor() { }

addToCart(theCartItem : CartItem ){

// first of all let's check if the item allready exsist in the cart
let alreadyExsistInCart : boolean = false ;
let theexsistingCartItem : CartItem = undefined ;
if (this.cartItems.length > 0) {
  //if there's items in the cart then check
  // if this item already exsist in the cartitems
  for (let item of this.cartItems)
  {
    if (item.id === theCartItem.id)
    {
      theexsistingCartItem = item ;
      alreadyExsistInCart = true ;
      break;
    }
  }
}

console.log(`the item already exsist : ${alreadyExsistInCart}`);

if (alreadyExsistInCart){
  //increment the quantity
  theexsistingCartItem.quantity ++ ;
  console.log(`the item already exsist , the quantity is : ${theCartItem.quantity}`);
  
  }
  else {
    // add to the cartItems 
    theCartItem.quantity = 1 ;
    this.cartItems.push(theCartItem);
    console.log(`the item doesn't exsist the quantity is : ${theCartItem.quantity}`);

  }

  // Now finnaly we compute the total quantities and price
this.computeCartTotal();
}

computeCartTotal(){
  
  let totalPriceValue : number  = 0 ;
  let totalQuantityValue : number = 0;

  for (let currentCartItem of this.cartItems )
  {
    totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice ;
    totalQuantityValue += currentCartItem.quantity ;
  }

  //publish the new values to all subscribers 
  this.totalPrice.next(totalPriceValue);
  this.totalQuantity.next(totalQuantityValue);
}

}