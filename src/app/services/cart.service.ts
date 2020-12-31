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
      for (let item of this.cartItems) {
        if (item.id === theCartItem.id) {
      theexsistingCartItem = item ;
      alreadyExsistInCart = true ;
      break;
    }
  }
}


if (alreadyExsistInCart){
  //increment the quantity
  theexsistingCartItem.quantity ++ ;
  
  }
  else {
    // add to the cartItems 
    theCartItem.quantity = 1 ;
    this.cartItems.push(theCartItem);

  }
  // Now finnaly we compute the total quantities and price
this.computeCartTotal();
}

computeCartTotal(){
  
  let totalPriceValue : number  = 0 ;
  let totalQuantityValue : number = 0;

    for (let currentCartItem of this.cartItems) {
    totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice ;
    totalQuantityValue += currentCartItem.quantity ;
  }

  //publish the new values to all subscribers 
  this.totalPrice.next(totalPriceValue);
  this.totalQuantity.next(totalQuantityValue);
}

DecrementQuantity(theItem : CartItem){
  theItem.quantity -- ;


  if (theItem.quantity === 0) {
    // the item no longer exsist so remove it from the table 
    this.removeItems(theItem);
  } else {

    this.computeCartTotal();

  }

}

removeItems(theItem : CartItem){
  //get the index of the item in the cartItems array 
    const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id === theItem.id);
  //if found, means greater than -1 , then remove it from thee array
  if (itemIndex > -1) {
    this.cartItems.splice(itemIndex, 1 );
    this.computeCartTotal();    
  }
}

}