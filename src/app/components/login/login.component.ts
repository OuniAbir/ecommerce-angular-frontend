import { Component, OnInit } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';
import myAppConfig from "../../config/my-app-config";
import * as oktaSignIn from "@okta/okta-signin-widget";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  oktaSignIn: any;

  constructor(private oktaAuthService: OktaAuthService) {
    this.oktaSignIn = new oktaSignIn({
      logo: 'src/assets/images/products',
      baseUrl: myAppConfig.oicd.issuer.split('/oauth2')[0],
      clientId: myAppConfig.oicd.clientId,
      redirectUri: myAppConfig.oicd.redirectUri,
      authParam: {
        pkfce: true, //proof key for code exchange.. use of a dynamic secrets for passing info btw app and authorization serve
        issuer: myAppConfig.oicd.issuer,
        scopes: myAppConfig.oicd.scopes,
      }
    })
  }

  ngOnInit(): void {
    this.oktaSignIn.remove();
    this.oktaSignIn.renderEl({
      el: '#okta-sign-in-widget' }, // this name should be same as div tag id in login.component.html
      (response) => {
        if (response.status === 'SUCCESS') {
          this.oktaAuthService.signInWithRedirect();

        }
      },
      (error) => {
        throw error;
      }

    );

  }

}
