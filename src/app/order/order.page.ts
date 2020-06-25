import { Component, OnInit, ApplicationRef, ViewChild } from '@angular/core';
import { NavController, ActionSheetController, IonContent } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/providers/config/config.service';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { LoadingService } from 'src/providers/loading/loading.service';
import { CouponService } from 'src/providers/coupon/coupon.service';
import { InAppBrowser, InAppBrowserObject } from '@ionic-native/in-app-browser/ngx';
//import Instamojo from 'instamojo-nodejs';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal/ngx';
import { Stripe } from '@ionic-native/stripe/ngx';
declare var braintree;
@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
})
export class OrderPage implements OnInit {

  @ViewChild(IonContent, { static: false }) content: IonContent;
  paypalClientId = "";
  paypalEnviroment = "";
  publicKeyStripe = "";
  amount;
  c;
  orderDetail: { [k: string]: any } = {};//include shipping address, billing address,  shipping methods.
  products = [];
  couponArray = [];
  couponApplied = 0;
  tokenFromServer = null;
  discount = 0;
  productsTotal = 0;
  totalAmountWithDisocunt = 0;
  nonce = '';
  stripeCard = {
    number: '',
    expMonth: 1,
    expYear: 2020,
    cvc: ''
  };
  browser: InAppBrowserObject;
  paymentMethods = [];

  paydata;
  datails = {
    MID: '',
    REQUEST_TYPE: '',
    CUST_ID: '',
    INDUSTRY_TYPE_ID: '',
    CHANNEL_ID: '',
    TXN_AMOUNT: '',
    WEBSITE: '',
    CALLBACK_URL: '',
    CHECKSUMHASH: '',
    ORDER_ID: '',
    MOBILE_NO: '',
    EMAIL: ''
  };

  formData = {
    mobile_no: '',
    email: '',
    user: '',
  };
  IsActivepaytm = true;
  //  IsCoupon=true;
  newpaytmdata: { [k: string]: any } = {};
  paymentPaytm: boolean = false;
  // rs




  // end rs
  constructor(
    public navCtrl: NavController,
    public httpClient: HttpClient,
    public config: ConfigService,
    public shared: SharedDataService,
    public loading: LoadingService,
    public couponProvider: CouponService,
    public actionSheetCtrl: ActionSheetController,
    public iab: InAppBrowser,
    private payPal: PayPal,
    private stripe: Stripe, ) {

  }

  //============================================================================================  
  //placing order
  addOrder = function (nonce) {

    this.loading.autoHide(17000);
    this.orderDetail.customers_id = this.shared.customerData.customers_id;
    this.orderDetail.customers_name = this.shared.orderDetails.delivery_firstname + " " + this.shared.orderDetails.delivery_lastname;
    this.orderDetail.customers_city = this.shared.customerData.customers_city;

    this.orderDetail.delivery_name = this.shared.orderDetails.billing_firstname + " " + this.shared.orderDetails.billing_lastname;
    this.orderDetail.email = this.shared.customerData.email;
    this.orderDetail.customers_telephone = this.shared.customerData.customers_telephone;
    this.orderDetail.delivery_suburb = this.shared.orderDetails.delivery_state
    this.orderDetail.customers_suburb = this.shared.orderDetails.customers_state;
    this.orderDetail.customers_address_format_id = '1';
    this.orderDetail.delivery_address_format_id = '1';
    this.orderDetail.products = this.products;
    this.orderDetail.is_coupon_applied = this.couponApplied;
    this.orderDetail.coupons = this.couponArray;
    this.orderDetail.coupon_amount = this.discount;
    this.orderDetail.totalPrice = this.totalAmountWithDisocunt;
    this.orderDetail.nonce = nonce;
    this.orderDetail.language_id = this.config.langId;
    if (this.shared.IsLocalwithSingal) {
      this.orderDetail.vendorStatus = "singleVendor";
      this.orderDetail.categories_id = this.products[0].categories_id;
    }
    else {
      this.orderDetail.vendorStatus = "multipleVendor";

    }
    //rrs
    this.orderDetail.vendorid = this.products[0].vendorid;

    // //debugger

    //rrs end
    var dat = this.orderDetail;
    var order;
    debugger
    this.httpClient.post(this.config.url + 'addtoorder', dat).subscribe((data: any) => {
      this.loading.hide();
      if (data.success == 1) {
        //debugger
        if (data.data.orders_data[0].payment_method == 'paytm') {
          order = data.data.orders_data[0];
          // this.paymentdatails(data.orders_data[0]);

          //debugger
          this.httpClient.post(this.config.url + 'paymentst',
            {
              mobile_no: order.customers_telephone,
              email: order.email,
              user: order.delivery_name.replace(' ', ''),
              orders_id: order.orders_id,
              totalPrice: order.order_price
            }
          ).subscribe((data: any) => {
            this.datails.MID = data.params.MID;
            this.datails.ORDER_ID = data.params.ORDER_ID;
            this.datails.CUST_ID = data.params.CUST_ID;
            this.datails.INDUSTRY_TYPE_ID = data.params.INDUSTRY_TYPE_ID;
            this.datails.CHANNEL_ID = data.params.CHANNEL_ID;
            this.datails.TXN_AMOUNT = data.params.TXN_AMOUNT;
            this.datails.WEBSITE = data.params.WEBSITE;
            this.datails.CALLBACK_URL = data.params.CALLBACK_URL;
            this.datails.CHECKSUMHASH = data.checkSum;
            this.datails.MOBILE_NO = data.params.MOBILE_NO;
            this.datails.EMAIL = data.params.EMAIL;
            this.datails.REQUEST_TYPE = data.params.REQUEST_TYPE;
            //debugger
            this.PaytmBrowse(this.datails.ORDER_ID)
          })
          //
        } else {
          this.shared.emptyCart();
          this.products = [];
          this.orderDetail = {};
          this.shared.orderDetails = {};
          this.navCtrl.navigateRoot("thank-you");
        }
      }
      if (data.success == 0) { this.alert.show(data.message); }
    }, err => {

      this.translate.get("Server Error").subscribe((res) => {
        this.alert.show(res + " " + err.status);
      });

    });
  };
  initializePaymentMethods() {
    // this.loading.show();
    var dat: { [k: string]: any } = {};
    dat.language_id = this.config.langId;
    dat.currency_code = this.config.currecnyCode;
    this.config.postHttp('getpaymentmethods', dat).then((data: any) => {
      //  this.loading.hide();
      if (data.success == 1) {
        this.paymentMethods = data.data;
        for (let a of data.data) {
          // if (a.method == "braintree_card" && a.active == '1') { this.getToken(); }
          // if (a.method == "braintree_paypal" && a.active == '1') { this.getToken(); }

          if (a.method == "paypal" && a.active == '1') {
            this.paypalClientId = a.public_key;
            if (a.environment == "Test") this.paypalEnviroment = "PayPalEnvironmentSandbox";
            else this.paypalEnviroment = "PayPalEnvironmentProduction"
          }
          if (a.method == "stripe" && a.active == '1') {
            this.publicKeyStripe = a.public_key;
            this.stripe.setPublishableKey(a.public_key);
          }
        }
      }
    },
      err => {
        this.shared.showAlert("getPaymentMethods Server Error");
      });
  }

  stripePayment() {
    // this.loading.show();
    this.stripe.createCardToken(this.stripeCard)
      .then(token => {
        // this.loading.hide();
        //this.nonce = token.id
        this.addOrder(token.id);
      })
      .catch(error => {
        //this.loading.hide();
        this.shared.showAlert(error)
      });
  }

  //============================================================================================  
  //CAlculate Discount total
  calculateDiscount = function () {
    var subTotal = 0;
    var total = 0;
    for (let value of this.products) {
      subTotal += parseFloat(value.subtotal);
      total += value.total;
    }
    this.productsTotal = subTotal;
    this.discount = (subTotal - total);
  };

  //============================================================================================  
  //CAlculate all total
  calculateTotal = function () {
    let a = 0;
    for (let value of this.products) {
      // // console.log(value);
      var subtotal = parseFloat(value.total);
      a = a + subtotal;
    }

    let b = parseFloat(this.orderDetail.total_tax.toString());
    let c = parseFloat(this.orderDetail.shipping_cost.toString());
    this.totalAmountWithDisocunt = parseFloat((parseFloat(a.toString()) + b + c).toString());
    // // console.log(" all total " + $scope.totalAmountWithDisocunt);
    // // console.log("shipping_tax " + $scope.orderDetail.shipping_tax);
    // // console.log(" shipping_cost " + $scope.orderDetail.shipping_cost);
    this.calculateDiscount();
  };

  //============================================================================================  
  //delete Coupon
  deleteCoupon = function (code) {

    this.couponArray.forEach((value, index) => {
      if (value.code == code) { this.couponArray.splice(index, 1); return true; }
    });


    this.products = (JSON.parse(JSON.stringify(this.shared.cartProducts)));
    this.orderDetail.shipping_cost = this.shared.orderDetails.shipping_cost;

    this.couponArray.forEach((value) => {
      //checking for free shipping
      if (value.free_shipping == true) {
        this.orderDetail.shippingName = 'free shipping';
        this.orderDetail.shippingCost = 0;
      }
      this.products = this.couponProvider.apply(value, this.products);
    });
    this.calculateTotal();
    if (this.couponArray.length == 0) {
      this.couponApplied = 0;
    }
  };
  //========================================================================================

  //============================================================================================   
  //getting getMostLikedProducts from the server
  getCoupon = function (code) {
    if (code == '' || code == null) {
      this.shared.showAlert('Please enter coupon code!');
      return 0;
    }
    this.loading.show();
    var dat = { 'code': code };
    this.config.postHttp('getcoupon', dat).then((data: any) => {
      this.loading.hide();
      if (data.success == 1) {
        let coupon = data.data[0]
        // // console.log($scope.coupon)
        this.applyCouponCart(coupon);
      }
      if (data.success == 0) {
        this.shared.showAlert(data.message);
      }
    }, error => {
      this.loading.hide();
      // console.log(error);
    });

  };

  //============================================================================================  
  // applying coupon on the cart
  applyCouponCart = function (coupon) {
    // checking the coupon is valid or not
    // tslint:disable-next-line: no-debugger
    debugger
    if (this.couponProvider.validateCouponService(coupon, this.products, this.couponArray) == false) {
      return 0;
    } else {
      // tslint:disable-next-line: triple-equals
      if (coupon.individual_use == 1) {
        this.products = (JSON.parse(JSON.stringify(this.shared.cartProducts)));
        this.couponArray = [];
        this.orderDetail.shipping_cost = this.shared.orderDetails.shipping_cost;
        // console.log('individual_use');
      }
      const v: { [k: string]: any } = {};
      v.code = coupon.code;
      v.amount = coupon.amount;
      v.product_ids = coupon.product_ids;
      v.exclude_product_ids = coupon.exclude_product_ids;
      v.product_categories = coupon.product_categories;
      v.excluded_product_categories = coupon.excluded_product_categories;
      v.discount = coupon.amount;
      v.individual_use = coupon.individual_use;
      v.free_shipping = coupon.free_shipping;
      v.discount_type = coupon.discount_type;
      //   v.limit_usage_to_x_items = coupon.limit_usage_to_x_items;
      //  v.usage_limit = coupon.usage_limit;
      // v.used_by = coupon.used_by ;
      // v.usage_limit_per_user = coupon.usage_limit_per_user ;
      // v.exclude_sale_items = coupon.exclude_sale_items;
      this.couponArray.push(v);
    }


    //checking for free shipping
    if (coupon.free_shipping == 1) {
      // $scope.orderDetail.shippingName = 'free shipping';
      this.orderDetail.shipping_cost = 0;
      //  // console.log('free_shipping');
    }
    //applying coupon service
    this.products = this.couponProvider.apply(coupon, this.products);
    if (this.couponArray.length != 0) {
      this.couponApplied = 1;
    }
    this.calculateTotal();
  };
  paytmOrder() {
    // alert(this.IsAllowPaytm)s;
    if (!this.IsAllowPaytm) {
      alert("Online payment not allowed for grocery and stationery items");
      return;
    }
    // let modal = this.modalCtrl.create(PaytmComponent);
    // modal.present();
    // this.navCtrl.push(PaytmComponent);
    this.addOrder('paytm');
    // this.paymentdatails();

  }
  payment = false;
  // rs remaining paytm this build
  PaytmBrowse(test) {

  }
  paypalPayment() {
    this.loading.autoHide(2000);
    this.payPal.init({
      PayPalEnvironmentProduction: this.paypalClientId,
      PayPalEnvironmentSandbox: this.paypalClientId
    }).then(() => {
      // this.loading.hide();
      // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
      this.payPal.prepareToRender(this.paypalEnviroment, new PayPalConfiguration({
        // Only needed if you get an "Internal Service Error" after PayPal login!
        //payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
      })).then(() => {
        //this.loading.show();
        let payment = new PayPalPayment(this.totalAmountWithDisocunt.toString(), this.config.paypalCurrencySymbol, 'cart Payment', 'sale');
        this.payPal.renderSinglePaymentUI(payment).then((res) => {
          // Successfully paidsign
          //  alert(JSON.stringify(res));
          //this.nonce = res.response.id;
          this.addOrder(res);
          // Example sandbox response
          //
          // {
          //   "client": {
          //     "environment": "sandbox",
          //     "product_name": "PayPal iOS SDK",
          //     "paypal_sdk_version": "2.16.0",
          //     "platform": "iOS"
          //   },
          //   "response_type": "payment",
          //   "response": {
          //     "id": "PAY-1AB23456CD789012EF34GHIJ",
          //     "state": "approved",
          //     "create_time": "2016-10-03T13:33:33Z",
          //     "intent": "sale"
          //   }
          // }
        }, () => {
          // console.log('Error or render dialog closed without being successful');
          this.shared.showAlert('Error or render dialog closed without being successful');
        });
      }, () => {
        // console.log('Error in configuration');
        this.shared.showAlert('Error in configuration');
      });
    }, () => {
      // console.log('Error in configuration');
      this.shared.showAlert('Error in initialization, maybe PayPal isnt supported or something else');
    });
  }

  couponslist() {
    // //debugger 
    var coupons = [];
    var vendors = [];
    this.products.forEach(element => {
      vendors.push(element.vendorid);
    });
    // + '<li>Cart Percentage <span>(cp9989)</a><p>{{"A percentage discount for the entire cart"}}</p></li>'
    //   + '<li>Cart Fixed <span>(cf9999)</span> <p>{{"A fixed total discount for the entire cart"}}</p></li>'
    //   + '<li>Product Fixed <span>(pf8787)</span></a><p>{{"A fixed total discount for selected products only"}}</p></li>'
    //   + '<li>Product Percentage <span>(pp2233)</span><p>{{"A percentage discount for selected products only"}}</p></li>'
    //   + '</ul>'; 
    // this.translate.get(array).subscribe((res) => { });
    // rrs test
    this.loading.show();
    this.httpClient.post(this.config.url + 'getcouponlist',
      {
        vendorid: JSON.stringify(vendors)
      }
    ).subscribe(async (data: any) => {
      this.loading.hide();
      if (data.data == undefined) {
        alert("No coupons available in this order");
        return
      }
      data.data.forEach(element => {
        var coupon = {
          icon: 'arrow-round-forward',
          text: element.description + '(' + element.code + ')',
          handler: () => {
            this.c = element.code;
          }
        };
        coupons.push(coupon);
      });

      let actionSheet = await this.actionSheetCtrl.create({
        header: 'Coupons List',
        buttons: coupons
      });

      actionSheet.present();
    })
    //rfrs end


  }
  //============================================================================================  
  //getting token from server
  getToken = function () {
    this.loading.autoHide(2000);
  };

  //================================================================================
  // braintree paypal method
  braintreePaypal = function (clientToken) {
    this.loading.autoHide(2000);
    var nonce = 0;
    var promise = new Promise((resolve, reject) => {
      braintree.setup(clientToken, "custom", {
        paypal: {
          container: "paypal-container",
          displayName: "Shop"
        },
        onReady: function () {

          // $(document).find('#braintree-paypal-button').attr('href', 'javascript:void(0)');
        },
        onPaymentMethodReceived: function (obj) {
          //   // console.log(obj.nonce);
          // this.nonce = obj.nonce;
          nonce = obj.nonce;
          resolve();
        }
      });


    });

    promise.then(
      (data) => {
        // // console.log(nonce);
        this.addOrder(nonce);
      },
      (err) => {  console.log(err); }
    );

  };
  //================================================================================
  // braintree creditcard method
  braintreeCreditCard = function (clientToken) {
    // this.loading.autoHide(2000);
    var nonce = 0;
    var promise = new Promise((resolve, reject) => {

      var braintreeForm = document.querySelector('#braintree-form');
      var braintreeSubmit = document.querySelector('button[id="braintreesubmit"]');
      braintree.client.create({
        authorization: clientToken
      }, function (clientErr, clientInstance) {
        if (clientErr) { }

        braintree.hostedFields.create({
          client: clientInstance,
          styles: {

          },
          fields: {
            number: {
              selector: '#card-number',
              placeholder: '4111 1111 1111 1111'
            },
            cvv: {
              selector: '#cvv',
              placeholder: '123'
            },
            expirationDate: {
              selector: '#expiration-date',
              placeholder: '10/2019'
            }
          }
        }, function (hostedFieldsErr, hostedFieldsInstance) {
          if (hostedFieldsErr) {
            // Handle error in Hosted Fields creation
            //alert("hostedFieldsErr" + hostedFieldsErr);
            document.getElementById('error-message').innerHTML = "hostedFieldsErr" + hostedFieldsErr;
            // console.log("hostedFieldsErr" + hostedFieldsErr);
            return;
          }

          braintreeSubmit.removeAttribute('disabled');
          braintreeForm.addEventListener('submit', function (event) {
            document.getElementById('error-message').innerHTML = null;
            event.preventDefault();
            hostedFieldsInstance.tokenize(function (tokenizeErr, payload) {
              if (tokenizeErr) {
                //alert('Error : ' + JSON.stringify(tokenizeErr.message));
                // Handle error in Hosted Fields tokenization
                document.getElementById('error-message').innerHTML = tokenizeErr.message;
                return 0;
              }
              // Put `payload.nonce` into the `payment-method-nonce` input, and then
              // submit the form. Alternatively, you could send the nonce to your server
              // with AJAX.

              // document.querySelector('input[name="payment-method-nonce"]').value = payload.nonce;
              // this.nonce = payload.nonce;
              // this.addOrder(payload.nonce);
              nonce = payload.nonce;
              resolve();
              //  // console.log(payload.nonce);

            });
          }, false);
        });
      });

    });
    promise.then(
      (data) => { //// console.log(nonce); 
        this.addOrder(nonce);
      },
      (err) => {  console.log(err); }
    );
  }
  paymentMehodChanged() {
    if (this.orderDetail.payment_method == "braintree_paypal") this.getToken();
    if (this.orderDetail.payment_method == "braintree_card") this.getToken();
    //if (this.orderDetail.payment_method == "stripe") this.stripe.setPublishableKey(this.publicKeyStripe);
    this.scrollToBottom();
  }
  selectPaymentMethod(method) {
    this.orderDetail.payment_method = method;
    this.scrollToBottom();
  }
  paymentdatails(paytmdata) { }


  scrollToBottom() {

    setTimeout(() => {
      this.content.scrollToBottom();
      // console.log("botton");
    }, 300);

  }

  //================================= instamojo ===========================

  instamojoPayment() {
    // this.loading.show();
    // this.config.get(Httpthis.config.url + 'instamojotoken').subscribe((data: any) => {
    //   this.loading.hide();
    //   // console.log(data);

    // }, err => {
    //   this.loading.hide();
    //   // console.log("error ");
    //   // console.log(err);

    // });
    // this.instamojoClient.payNow({ purpose: "test", amount: "9.0" }).then(response => {
    //   // alert("Payment complete: " + JSON.stringify(response));
    // }).catch(err => {
    //   // alert("Payment failed: " + JSON.stringify(err));
    //   throw err;
    // });

    // this.loading.autoHide(3000);

    // this.instamojoClient = new Instamojo(this.httpClient, this.iab, this.config.url + 'instamojotoken');
    // var data = this.instamojoClient.getPaymentFields();
    // data.purpose = "Order Payment";                     // REQUIRED
    // data.amount = this.totalAmountWithDisocunt;// REQUIRED
    // // data.buyer_name = this.shared.customers_firstname + " " + this.shared.customers_lastname;
    // // data.email = this.shared.customerData.email
    // data.currency = this.config.currency;
    // //data.phone = this.shared.customerData.phone;
    // // do not change this
    // data.redirect_url = "http://localhost";
    // this.instamojoClient.payNow(data).then(response => {
    //   this.addOrder(response);
    //   //alert("Payment complete: " + JSON.stringify(response));
    //   // console.log(response);
    // }).catch(err => {
    //   this.shared.toastWithCloseButton("Payment failed: " + JSON.stringify(err));
    //   // console.log(JSON.stringify(err));
    //   throw err;
    // });
    //call the Safari View Controller

    // end of safari view controller
  }
  IsAllowPaytm = true;
  ngOnInit() {
    debugger
    var list = [];
    this.IsAllowPaytm = true;
    this.orderDetail = (JSON.parse(JSON.stringify(this.shared.orderDetails)));
    this.products = (JSON.parse(JSON.stringify(this.shared.cartProducts)));
    this.products.filter(item => {
      debugger
      list = item.categories.filter(cat => cat.categories_name == "Grocery" || cat.categories_name == "Stationery");
      if (list.length > 0)
        this.IsAllowPaytm = false;
    });
    -
      this.calculateTotal();
    // this.initializePaymentMethods();

  }
  openHomePage() {
    this.navCtrl.navigateRoot("cart");
  }
  hyperpayPayment() {
    this.addOrder("null");
  }
}
