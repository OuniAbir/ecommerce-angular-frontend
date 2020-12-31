import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup  } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup : FormGroup ;
  constructor(private formBuilder : FormBuilder) { }

  ngOnInit(): void {
  
    // build the form group for customer
    this.checkoutFormGroup = this.formBuilder.group({
      customer : this.formBuilder.group({
        //define the formcontrol of thatformGroup
        //intiate the formControls value with emppty String
        firsName : [''],
        lastName : [''],
        email:[''],
      })
    });
  }

   onSubmit(){
    console.log("handling the ssubmit button");
    console.log(this.checkoutFormGroup.get('customer').value);    
  }
}
