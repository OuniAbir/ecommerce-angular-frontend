import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { Order } from 'src/app/common/order';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutFormService } from 'src/app/services/checkout-form.service';
import { CheckoutServiceService } from 'src/app/services/checkout-service.service';
import { CheckoutFormValidators } from 'src/app/validators/checkout-form-validators';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;
  totalPrice: number = 0;
  totalQuantity: number = 0;
  CreditCardYears: number[] = [];
  CreditCardMonths: number[] = [];
  countries : Country[] = [] ;
  shipppingAddressStates : State[]=[];
  billingAddressStates : State[]=[];

  constructor(private formBuilder: FormBuilder, private cartService: CartService, private checkoutFormService : CheckoutFormService,
    private checkoutService : CheckoutServiceService,
    private router :Router ) { }

  ngOnInit(): void {

    // build the form group for customer
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        //define the formcontrol of thatformGroup
        //intiate the formControls value with emppty String
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), CheckoutFormValidators.notOnlyWhitespace]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), CheckoutFormValidators.notOnlyWhitespace]),
        email: new FormControl('',
          [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
      }),
      shipping: this.formBuilder.group({
        street:  new FormControl('', [Validators.required, Validators.minLength(2), CheckoutFormValidators.notOnlyWhitespace]),
        city:  new FormControl('', [Validators.required, Validators.minLength(2), CheckoutFormValidators.notOnlyWhitespace]),
        country: new FormControl('', [Validators.required]),
        state:  new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), CheckoutFormValidators.notOnlyWhitespace]),
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard:  new FormControl('', [Validators.required, Validators.minLength(2),
                                          CheckoutFormValidators.notOnlyWhitespace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: [''],
        expirationYear: [''],

      }),
      billing: this.formBuilder.group({
        street:  new FormControl('', [Validators.required, Validators.minLength(2), CheckoutFormValidators.notOnlyWhitespace]),
        city:  new FormControl('', [Validators.required, Validators.minLength(2), CheckoutFormValidators.notOnlyWhitespace]),
        country: new FormControl('', [Validators.required]),
        state:  new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), CheckoutFormValidators.notOnlyWhitespace]),
      }),
    });
    // populate the countries
    this.checkoutFormService.getCountries().subscribe(
      data => {
        console.log("Retrived countries : " + JSON.stringify(data));
        this.countries = data ;
      }
    )


    // subscribe to cartService.totalQuantity
    this.cartService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity
    );

    // subscribe to cartService.totalPrice
    this.cartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice
    );
    const startMonth: number = new Date().getMonth() + 1;
    console.log("startMonth: " + startMonth);
    this.getCreditCardYears();
    this.getCreditCardMonths(startMonth);
  }

  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }

  get shippingAddressStreet(){ return this.checkoutFormGroup.get('shipping.street');};
  get shippingAddresscity(){ return this.checkoutFormGroup.get('shipping.city');};
  get shippingAddresscountry(){ return this.checkoutFormGroup.get('shipping.country');};
  get shippingAddressstate(){ return this.checkoutFormGroup.get('shipping.state');};
  get shippingAddresszipCode(){ return this.checkoutFormGroup.get('shipping.zipCode');};

  get billingAddressStreet(){ return this.checkoutFormGroup.get('billing.street');};
  get billingAddresscity(){ return this.checkoutFormGroup.get('billing.city');};
  get billingAddresscountry(){ return this.checkoutFormGroup.get('billing.country');};
  get billingAddressstate(){ return this.checkoutFormGroup.get('billing.state');};
  get billingAddresszipCode(){ return this.checkoutFormGroup.get('billing.zipCode');};

  get creditCardType() { return this.checkoutFormGroup.get('creditCard.cardType'); }
  get creditCardNameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get creditCardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get creditCardSecurityCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); }

getStates(formGroupName : string ){
  const formGroup = this.checkoutFormGroup.get(formGroupName);
  const countryCode = formGroup.value.country.code ;

  this.checkoutFormService.getStatesByCountryCode(countryCode).subscribe(
      data => {
      console.log("Retrived countries : " + JSON.stringify(data));
      if (formGroupName === 'shipping') {
        this.shipppingAddressStates = data ;
      } else {
        this.billingAddressStates = data ;

      } ;
      // select the first item by default
        formGroup.get('state').setValue(data[0]);
    }

  )


}
  copyShippingToBillingAddress(event) {
    if (event.target.checked) {
      this.checkoutFormGroup.controls.billing.setValue(this.checkoutFormGroup.controls.shipping.value);
      // bug fix for states
      this.billingAddressStates = this.shipppingAddressStates ;
    } else {
      this.checkoutFormGroup.controls.billing.reset();
      // bug fix for states
      this.billingAddressStates = [];
    }
  }

  onSubmit() {
    console.log("handling the ssubmit button");
    // touching all the fields to trigger the display of the error messages
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    // set up order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    // get cart items
    const cartItems = this.cartService.cartItems;

    // create orderItems from cartItems
    // - long way
    /*
    let orderItems: OrderItem[] = [];
    for (let i=0; i < cartItems.length; i++) {
      orderItems[i] = new OrderItem(cartItems[i]);
    }
    */

    // - short way of doing the same thingy
    let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));

    // set up purchase
    let purchase = new Purchase();

    // populate purchase - customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    // populate purchase - shipping address
    purchase.shippingAddress = this.checkoutFormGroup.controls['shipping'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    // populate purchase - billing address
    purchase.billingAddress = this.checkoutFormGroup.controls['billing'].value;
    // we want only the state/country name not all the state/country  class fields
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    // populate purchase - order and orderItems
    purchase.order = order;
    purchase.orderItems = orderItems;

    // call REST API via the CheckoutService
    this.checkoutService.placeOrder(purchase).subscribe({
        next: response => {
          alert(`Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`);
          // reset cart
          this.resetCart();

        },
        error: err => {
          alert(`There was an error: ${err.message}`);
        }
      }
    );
  }

  resetCart() {
    // reset cart data and set totalPrice/totalQuantity to 0 and sent it to all subscribers
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    // reset the form
    this.checkoutFormGroup.reset();

    // navigate back to the products page
    this.router.navigateByUrl("/products");
  }

  getCreditCardMonths(startMonth: number) {
    let data: number[] = [];
    // build an array for "month" drop downList
    // start at the current month and loop until 12
    for (let themonth: number = startMonth; themonth <= 12; themonth++) {
      data.push(themonth);
    }
    this.CreditCardMonths = data;
  }

  getCreditCardYears() {
    let data: number[] = [];
    // build an array for "year" drop downList
    // start at the current year and loop for the next 10
    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;
    for (let theYear = startYear; theYear <= endYear; theYear++) {
      data.push(theYear);
    }

    this.CreditCardYears = data;
  }

  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);
    // if the current year equals the selected year, then start with the current month
    let startMonth: number;
    console.log(`new year selected : ${selectedYear}`);

    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    }
    else {
      startMonth = 1;
    }
    this.getCreditCardMonths(startMonth);
  }
}
