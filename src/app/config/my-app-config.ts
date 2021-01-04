export default {
  //Open ID Connec config
oicd : {
  clientId :'0oa3azani1KQPKTTJ5d6' ,
  issuer : 'https://dev-1302852.okta.com/oauth2/default', // distributeur of tokens
  redirectUri : 'http://localhost:4200/login/callback' ,
  scopes : ['openid', 'profile','email' ], //scopes provides access to info abt the user
}

}
