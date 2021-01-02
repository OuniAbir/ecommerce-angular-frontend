import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutFormService } from 'src/app/services/checkout-form.service';


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

  constructor(private formBuilder: FormBuilder, private cartService: CartService, private checkoutFormService : CheckoutFormService) { }

  ngOnInit(): void {

    // build the form group for customer
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        //define the formcontrol of thatformGroup
        //intiate the formControls value with emppty String
        firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
        email: new FormControl('',
          [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
      }),
      shipping: this.formBuilder.group({
        country: [''],
        street: [''],
        city: [''],
        state: [''],
        zipCode: ['']
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: [''],

      }),
      billing: this.formBuilder.group({
        country: [''],
        street: [''],
        city: [''],
        state: [''],
        zipCode: ['']
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
    console.log(this.checkoutFormGroup.get('customer').value);
    console.log(this.checkoutFormGroup.get('shipping').value);
    console.log(this.checkoutFormGroup.get('creditCard').value);
    console.log(this.checkoutFormGroup.get('billing').value);
    // touching all the fields to trigger the display of the error messages 
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();      
    }

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
