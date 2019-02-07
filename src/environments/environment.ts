// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiURL: 'http://localhost/api',  //If virtual host is set in xampp to localhost !!!
  URL: 'http://localhost:4200',
  gmapKey: 'AIzaSyDJX3_xSyhfZCyA2Z20f1d74X8sHOkX9dE',
  fbKey : '397476587654542',
  payPalKey: 'AezsO1aLaK794S1JMb6BJPHhflVEHIrBJdawBSRO_ufHO_A85fexSF1vD6Z6yPicBfzeAOWtaOBcMkhK',
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
