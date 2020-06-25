import { Component, OnInit, ApplicationRef } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { SpinnerDialog } from '@ionic-native/spinner-dialog/ngx';

import { ThemeableBrowser } from '@ionic-native/themeable-browser/ngx';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/providers/config/config.service';
import { LoadingService } from 'src/providers/loading/loading.service';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'app-shipping-method',
  templateUrl: './shipping-method.page.html',
  styleUrls: ['./shipping-method.page.scss'],
})
export class ShippingMethodPage implements OnInit {

  shippingMethod = new Array;
  selectedMethod = true;
  constructor(
    public navCtrl: NavController,
    public shared: SharedDataService,
    public http: HttpClient,
    public storage: Storage,
    public spinnerDialog: SpinnerDialog,
    public config: ConfigService,
    public loading: LoadingService,
    public themeableBrowser: ThemeableBrowser,
    private applicationRef: ApplicationRef,
  ) {
    var list=this.shared.cartProducts.filter(item=>item.vendorid==this.shared.cartProducts[0].vendorid);
    if(list.length==this.shared.cartProducts.length){
      this.shared.IsLocalwithSingal=true;
      this.shared.IsCoupon=true;
    }else{
      this.shared.IsLocalwithSingal=false;
      this.shared.IsCoupon=false;
    }
 
 //e
 // tslint:disable-next-line: prefer-const
    let dat: { [k: string]: any } = {};
    dat.tax_zone_id = this.shared.orderDetails.tax_zone_id;
 // data.shipping_method = this.shared.orderDetails.shipping_method;
 // data.shipping_method = 'upsShipping';
 // data.shipping_method_code = this.shared.orderDetails.shipping_method_code;
    dat.state = this.shared.orderDetails.delivery_state;
    dat.city = this.shared.orderDetails.delivery_city_name;
    dat.country_id = this.shared.orderDetails.delivery_country_id;
    dat.postcode = this.shared.orderDetails.delivery_postcode;
    dat.zone = this.shared.orderDetails.delivery_zone;
    dat.street_address = this.shared.orderDetails.delivery_street_address;
    dat.products_weight = this.calculateWeight();
    dat.products_weight_unit = 'g'
    dat.products = this.shared.cartProducts;
    dat.language_id = config.langId;
    dat.IsSingleVendor=this.shared.IsLocalwithSingal;
    dat.vendorid=this.shared.vendorData.vendorid;
    dat.IsApp=1;

 // tslint:disable-next-line: triple-equals
    if(this.shared.orderDetails.delivery_delivery=="Deliveryable"){
   this.loading.show();
   debugger
   this.config.postHttp('getrate', dat).then((data: any) => {
      this.loading.hide();
      // tslint:disable-next-line: triple-equals
      if (data.success == 1) {
        const m = data.data.shippingMethods;
        // tslint:disable-next-line: only-arrow-functions
        this.shippingMethod = Object.keys(m).map(function (key) { return m[key]; });
        this.shared.orderDetails.total_tax = data.data.tax;
      }
    });
  }
  else{
    this.shared.orderDetails.total_tax ='0';//rrs data.data.tax;
     }
     }
  // ================================================================================
  // calcualting products total weight
    calculateWeight = function () {
    let pWeight = 0;
    let totalWeight = 0;
    for (const value of this.shared.cartProducts) {
      pWeight = parseFloat(value.weight);
      // tslint:disable-next-line: triple-equals
      if (value.unit == 'kg') {
        pWeight = parseFloat(value.weight) * 1000;
      }
      //  else {
      totalWeight = totalWeight + (pWeight * value.customers_basket_quantity);
      //   }
      //  // console.log(totalWeight);
    }
    return totalWeight;
  };
    selectShipping(input){
    this.selectedMethod = false;
    this.shared.orderDetails.shipping_cost = "0";//data.rate;
    this.shared.orderDetails.shipping_method =input;// data.name + '(' + data.shipping_method + ')';
    // // console.log(this.shared.orderDetails);
  }
  setMethod(data) {
    this.selectedMethod = false;
    this.shared.orderDetails.shipping_cost = data.rate;
    this.shared.orderDetails.shipping_method = data.name + '(' + data.shipping_method + ')';
    // // console.log(this.shared.orderDetails);
  }
  openOrderPage() {
    this.navCtrl.navigateForward("/order");
  }
  ngOnInit() {

  }
  getProducts() {
    let temp = [];
    this.shared.cartProducts.forEach(element => {
      temp.push({
        customers_basket_quantity: element.customers_basket_quantity,
        final_price: element.final_price,
        price: element.price,
        products_id: element.products_id,
        total: element.total,
        unit: element.unit,
        weight: element.weight
      })
    });
    return temp;
  }
}
        // attributes: element.attributes,
        // cart_id: element.cart_id,
        // categories: element.categories,
        // customers_basket_quantity: element.customers_basket_quantity,
        // final_price: element.final_price,
        // model: element.model,
        // on_sale: element.on_sale,
        // price: element.price,
        // products_id: element.products_id,
        // products_name: element.products_name,
        // subtotal: element.subtotal,
        // total: element.total,
        // unit: element.unit,
        // weight: element.weight