import { FormControl, ValidationErrors } from "@angular/forms";

export class CheckoutFormValidators {

    // whitespace Validation/:failed validation check return a Map of errors : ValidationErrors
    static notOnlyWhitespace(formControl: FormControl): ValidationErrors {
        // if validation fails return erro r
        if ((formControl.value != null) && (formControl.value.trim().length === 0)) {
            // invalid , return a validation error key that will be checked later in the html template
            // it's like a convention to nat the key as the methode 
            return { 'notOnlyWhitespace': true };

        } else {
            // if validation passes return null
            return null;
        }


    }

}
