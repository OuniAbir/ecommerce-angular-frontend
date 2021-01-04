import { Component, OnInit } from '@angular/core';
import { OktaAuthService } from "@okta/okta-angular";


@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  isAuthentificated: boolean = false;
  userFullName: string;
  constructor(private oktaAuthService: OktaAuthService) { }

  ngOnInit(): void {

    //subscribe to authentification state change
    this.oktaAuthService.$authenticationState.subscribe(
      (result) => {
        this.isAuthentificated = result;
        this.getUserDetails();
      }
    )
  }
  getUserDetails() {

    if (this.isAuthentificated) {

      // Fetch the user logged in details
      this.oktaAuthService.getUser().then(
        res => {
          this.userFullName = res.name;
        }
      )

    }
  }
  logout(){
    // terminates the session wwith Okta and removes current tokens
    this.oktaAuthService.signOut();
  }

}
