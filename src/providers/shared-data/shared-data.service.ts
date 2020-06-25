
import { Injectable } from '@angular/core';
import { ConfigService } from '../config/config.service';

import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { LoadingService } from '../loading/loading.service';
import { Platform, ToastController, Events, AlertController, ModalController, NavController } from '@ionic/angular';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { FCM } from '@ionic-native/fcm/ngx';
import { Device } from '@ionic-native/device/ngx';
import { SelectCityPage } from 'src/app/select-city/select-city.page';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
@Injectable()

export class SharedDataService {

  public banners = [];
  public tab1 = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  public tab2 = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  public tab3 = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  public flashSaleProducts = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  public allCategories: any = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  public categories: any = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  public subCategories: any = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  public customerData: { [k: string]: any } = {};
  public recentViewedProducts = new Array();
  public cartProducts = new Array();
  public privacyPolicy = '';
  public termServices = '';
  public refundPolicy = '';
  public aboutUs = '';
  public cartquantity = 0;
  public wishList = new Array();
  public tempdata: { [k: string]: any } = {};
  public dir = 'ltr';
  public selectedFooterPage = 'HomePage';
  public currentOpenedModel: any = null;
  public vendorData: { [k: string]: any } = {};
  public vendorStatus: any = false;
  public IsEntryByCat = 0;
  public IsLocalwithSingal = false;
  public IsCoupon = false;
  //rs

  public cityList = new Array();
  public cityid: any = null;
  public cityName: any = null;


  public subCategoriesF = new Array();
  public categoryId: any = null;
  public categoryName: any = '';

  // rs
  public orderDetails = {
    vendorStatus: '',
    tax_zone_id: '',
    delivery_firstname: '',
    delivery_lastname: '',
    delivery_state: '',
    delivery_city_id: '',
    delivery_city_name: '',
    delivery_zone: '',
    delivery_country: 'India',
    delivery_country_id: '99',
    delivery_street_address: '',
    delivery_country_code: '',
    delivery_phone: '',
    delivery_pincode_id: '',
    delivery_postcode: '',
    delivery_locality: '',
    delivery_delivery: '',

    billing_firstname: '',
    billing_lastname: '',
    billing_state: '',
    billing_city_id: '',
    billing_city_name: '',
    billing_postcode: '',
    billing_zone: '',
    billing_country: 'India',
    billing_country_id: '99',
    billing_street_address: '',
    billing_country_code: '',
    billing_phone: '',
    total_tax: '0',
    shipping_cost: '',
    shipping_method: '',
    payment_method: '',
    comments: ''
  };
  public translationListArray = [];
  public singleProductPageData = [];
  public singlePostData: any;
  myOrderDetialPageData: any;

  constructor(
    private nativeAudio: NativeAudio,
    public nav: NavController,
    private afMessaging: AngularFireMessaging,
    public config: ConfigService,
    public httpClient: HttpClient,
    public storage: Storage,
    public loading: LoadingService,
    public events: Events,
    public platform: Platform,
    public device: Device,
    public fcm: FCM,
    public alertCtrl: AlertController,
    public appVersion: AppVersion,
    public oneSignal: OneSignal,
    private toastCtrl: ToastController,
    public splashScreen: SplashScreen,
    public modalCtrl: ModalController,

  ) {

    this.platform.ready().then(() => {
      // rs
      if(this.cityid==null){
        this.ChangeCity();
      }
      this.httpClient.post(config.url + 'allcategories', { language_id: config.langId }).subscribe((data: any) => {
        // tslint:disable-next-line: triple-equals
        this.allCategories = [];
        this.categories = [];
        this.subCategories = [];
        if (data.success == '2') {
          // alert(data.message);
        }
        // tslint:disable-next-line: triple-equals
        if (data.success == '3') {
          // alert(data.message);
          window.open('https://play.google.com/store/apps/details?id=com.offersindiafinal.in', '_system', 'location=no');
          //  this.InApp.create( "https://play.google.com/store/apps/details?id=com.offersindiafinal.in","_blank");

        }
        for (let value of data.data) {
          if (value.parent_id == 0) this.categories.push(value);
          else this.subCategories.push(value);
        }
      });
      let headers = new Headers();
      headers.append('Content-Type', 'application/json; charset=utf-8');
      headers.append('Accept', '/');
      headers.append("Access-Control-Allow-Credentials", "true");
      headers.append('Upgrade-Insecure-Requests', '1');
      headers.append('withCredentials', 'true');
      headers.append("Access-Control-Allow-Origin", "http://localhost:8100");
      headers.append("Access-Control-Allow-Credentials", "true");
      headers.append("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
      headers.append("Access-Control-Allow-Headers", "Content-Type,Authorization,Upgrade-Insecure-Requests");
      //getting all allCategories
      this.httpClient.post(config.url + 'citieslist', headers).subscribe((data: any) => {
        //debugger
        for (let value of data.data) {
          this.cityList.push(value);
        }
      });
      //rs
      this.config.getHttp("applabels3?lang=" + this.config.langId).then((data: any) => {
        this.translationListArray = data;
      });
    });
    events.subscribe('settingsLoaded', () => {
      this.onStart();
    });

    //getting recent viewed items from local storage
    storage.get('customerData').then((val) => {
      if (val != null || val != undefined) this.customerData = val;
    });
    this.cityid = localStorage.cityId;
    storage.get('cityId').then((val) => {
      debugger
      if (val != null || val != undefined) this.cityid = val;
    });
    storage.get('cityName').then((val) => {
      debugger
      if (val != null || val != undefined) this.cityName = val;
    });
    //getting recent viewed items from local storage
    storage.get('recentViewedProducts').then((val) => {
      if (val != null) this.recentViewedProducts = val;
    });
    if (this.platform.is('cordova')) {
    }
    //getting recent viewed items from local storage
    storage.get('cartProducts').then((val) => {
      if (val != null) this.cartProducts = val;
      this.cartTotalItems();
      // // console.log(val);
    });
    storage.get('cartVendor').then((val) => {
      if (val != null) this.vendorData = val;
      // // console.log(val);
    });
    //getting allpages from the server
    this.httpClient.post(config.url + 'getallpages', { language_id: this.config.langId }).subscribe((data: any) => {
      if (data.success == 1) {
        let pages = data.pages_data;
        for (let value of pages) {

          if (value.slug == 'privacy-policy') this.privacyPolicy = value.description;
          if (value.slug == 'term-services') this.termServices = value.description;
          if (value.slug == 'refund-policy') this.refundPolicy = value.description;
          if (value.slug == 'about-us') this.aboutUs = value.description;
        }
      }
    });
    //---------------- end -----------------


  }
  public splashScreenHide = false;
  hideSplashScreen() {
    if (this.platform.is('cordova')) {
      if (!this.splashScreenHide) { this.splashScreen.hide(); this.splashScreenHide = true; }
    }
  }
  onStart() {
    //getting all banners
    // debugger
    // this.config.getHttp('getbanners').then((data: any) => {
    //   this.banners = data.data;
    // });
    //getting tab 1
    let data: { [k: string]: any } = {};
    if (this.customerData.customers_id != null)
      data.customers_id = this.customerData.customers_id;
    data.page_number = 0;
    data.language_id = this.config.langId;
    data.currency_code = this.config.currecnyCode;

    data.type = 'flashsale';
    this.config.postHttp('getallproducts', data).then((data: any) => {
      this.flashSaleProducts = data.product_data
    });
    data.type = 'top seller';
    this.config.postHttp('getallproducts', data).then((data: any) => {
      this.tab1 = data.product_data
    });
    //getting tab 2
    data.type = 'special';
    this.config.postHttp('getallproducts', data).then((data: any) => {
      this.tab2 = data.product_data
    });
    //getting tab 3
    data.type = 'most liked';
    this.config.postHttp('getallproducts', data).then((data: any) => {
      this.tab3 = data.product_data
    });



    //getting allpages from the server
    this.config.postHttp('getallpages', { language_id: this.config.langId, currency_code: this.config.currecnyCode }).then((data: any) => {
      if (data.success == 1) {
        let pages = data.pages_data;
        for (let value of pages) {
          if (value.slug == 'privacy-policy') this.privacyPolicy = value.description;
          if (value.slug == 'term-services') this.termServices = value.description;
          if (value.slug == 'refund-policy') this.refundPolicy = value.description;
          if (value.slug == 'about-us') this.aboutUs = value.description;
        }
      }
    });
  }
  async ChangeCity() {
    // const modal = await this.modalCtrl.create({ component: SelectCityPage, componentProps: { page: 'home/0' } });
    // // rs
    // modal.onDidDismiss().then((dataReturned) => {
    //   debugger
    //   this.config.postHttp('getbanners',
    //     { cityid: this.cityid }).then((data: any) => {
    //       this.banners = data.data;
          
    //     });
    //   // tslint:disable-next-line: triple-equals
    //   this.nav.navigateForward('/categories4/0/0');
    // });
    // return modal.present();
    // rs

  }
  //adding into recent array products
  addToRecent(p) {
    let found = false;
    for (let value of this.recentViewedProducts) {
      if (value.products_id == p.products_id) { found = true; }
    }
    if (found == false) {
      this.recentViewedProducts.push(p);
      this.storage.set('recentViewedProducts', this.recentViewedProducts);
    }
  }
  //removing from recent array products
  removeRecent(p) {
    this.recentViewedProducts.forEach((value, index) => {
      if (value.products_id == p.products_id) {
        this.recentViewedProducts.splice(index, 1);
        this.storage.set('recentViewedProducts', this.recentViewedProducts);
      }
    });
    this.events.publish('recentDeleted');
  }
  //adding into cart array products
  addToCart(product, attArray) {
debugger
    // // console.log(this.cartProducts);
    let attributesArray = attArray;
    if (attArray.length == 0 || attArray == null) {
      //// console.log("filling attirbutes");
      attributesArray = [];
      if (product.attributes != undefined) {
        // // console.log("filling product default attibutes");
        product.attributes.forEach((value, index) => {
          let att = {
            products_options_id: value.option.id,
            products_options: value.option.name,
            products_options_values_id: value.values[0].id,
            options_values_price: value.values[0].price,
            price_prefix: value.values[0].price_prefix,
            products_options_values: value.values[0].value,
            name: value.values[0].value + ' ' + value.values[0].price_prefix + value.values[0].price + " " + this.config.currency
          };
          attributesArray.push(att);
        });
      }
    }
    //  if(checkDublicateService(product.products_id,$rootScope.cartProducts)==false){

    let pprice = product.products_price
    let on_sale = false;
    if (product.discount_price != null) {
      pprice = product.discount_price;
      on_sale = true;
    }
    if (product.flash_price != null) {
      pprice = product.flash_price;
    }
    // // console.log("in side producs detail");
    // // console.log(attributesArray);
    // // console.log(this.cartProducts);
    let finalPrice = this.calculateFinalPriceService(attributesArray) + parseFloat(pprice);
    let obj = {
      cart_id: product.products_id + this.cartProducts.length,
      products_id: product.products_id,
      manufacture: product.manufacturers_name,
      customers_basket_quantity: 1,
      final_price: finalPrice,
      model: product.products_model,
      categories: product.categories,
      categories_id: product.categoryId,
      variable_product_id:product.variable_product_id,
      // categories_name: product.categories_name,
      quantity: product.products_quantity,
      weight: product.products_weight,
      on_sale: on_sale,
      unit: product.products_weight_unit,
      image: product.products_image,

      attributes: attributesArray,
      products_name: product.products_name,
      price: pprice,
      subtotal: finalPrice,
      total: finalPrice,
      vendorid: this.vendorData.vendorid
    }
    this.cartProducts.push(obj);
    this.storage.set('cartProducts', this.cartProducts);

    this.cartTotalItems();

    // // console.log(this.cartProducts);
    //// console.log(this.cartProducts);
  }
  //removing from recent array products
  removeCart(p) {
    this.cartProducts.forEach((value, index) => {
      if (value.cart_id == p) {
        this.cartProducts.splice(index, 1);
        this.storage.set('cartProducts', this.cartProducts);
      }
    });
    this.cartTotalItems();
  }
  emptyCart() {
    this.cartProducts = [];
    this.storage.set('cartProducts', this.cartProducts);
    this.cartTotalItems();
  }
  emptyRecentViewed() {
    this.recentViewedProducts = [];
    this.storage.set('recentViewedProducts', this.recentViewedProducts);
  }
  calculateFinalPriceService(attArray) {
    let total = 0;
    attArray.forEach((value, index) => {
      let attPrice = parseFloat(value.options_values_price);
      if (value.price_prefix == '+') {
        //  // console.log('+');
        total += attPrice;
      }
      else {
        //  // console.log('-');
        total -= attPrice;
      }
    });
    // // console.log("max "+total);
    return total;
  }

  //Function calcualte the total items of cart
  cartTotalItems = function () {
    this.events.publish('cartChange');
    let total = 0;
    for (let value of this.cartProducts) {
      total += value.customers_basket_quantity;
    }
    this.cartquantity = total;
    // // console.log("updated");
    return total;
  };

  removeWishList(p) {
    this.loading.show();
    let data: { [k: string]: any } = {};
    data.liked_customers_id = this.customerData.customers_id;
    data.liked_products_id = p.products_id;
    this.config.postHttp('unlikeproduct', data).then((data: any) => {
      this.loading.hide();
      if (data.success == 1) {
        this.events.publish('wishListUpdate', p.products_id, 0);
        p.isLiked = 0;
        this.wishList.forEach((value, index) => {
          if (value.products_id == p.products_id) this.wishList.splice(index, 1);
        });
      }
      if (data.success == 0) {

      }
    });
  }
  addWishList(p) {
    this.loading.show();
    let data: { [k: string]: any } = {};
    data.liked_customers_id = this.customerData.customers_id;
    data.liked_products_id = p.products_id;
    this.config.postHttp('likeproduct', data).then((data: any) => {
      this.loading.hide();
      if (data.success == 1) {
        this.events.publish('wishListUpdate', p.products_id, 1);
        p.isLiked = 1;
      }

      if (data.success == 0) { }
    });
  }


  login(data) {
    this.customerData = data;
    // this.customerData.customers_telephone = data.phone;
    // this.customerData.phone = data.phone;
    // this.customerData.customers_id = data.id;
    // this.customerData.customers_firstname = data.first_name;
    // this.customerData.customers_lastname = data.last_name;
    // this.customerData.phone = data.phone;
    // this.customerData.avatar = data.avatar;
    // this.customerData.image_id = data.image_id;
    // this.customerData.customers_dob = data.dob;
    this.storage.set('customerData', this.customerData);
    this.subscribePush();
    // console.log(this.customerData);
  }
  logOut() {
    this.loading.autoHide(500);
    this.customerData = {};
    this.storage.set('customerData', this.customerData);
    // this.fb.logout();
  }


  // ============================================================================================
  // getting token and passing to server
  subscribePush() {
    debugger
    if (this.platform.is('cordova')) {
      // pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
      // tslint:disable-next-line: triple-equals
      this.config.notificationType='fcm';
      if (this.config.notificationType == 'fcm') { 
        try {
          this.fcm.subscribeToTopic('marketing');

          this.fcm.getToken().then(token => {
            // alert("registration" + token);
            // // console.log(token);
            // alert(token);
            // this.storage.set('registrationId', token);
            this.registerDevice(token);
          })

          this.fcm.onNotification().subscribe(data => {
            if (data.wasTapped) {
              // console.log('Received in background');
              this.nativeAudio.preloadSimple('test1234test', 'assets/bell.mp3');
              this.nativeAudio.play('test1234test');
            } else {
              // this.nativeAudio.preloadComplex('music', 'path/to/file2.mp3', 1, 1, 0).then(onSuccess, onError);
              // window.plugins.NativeAudio.preloadComplex( 'music', 'audio/music.mp3', 1, 1, 0, function(msg){
              // }, function(msg){
              //   // console.log( 'error: ' + msg );
              // });
              // console.log("Received in foreground");
              this.nativeAudio.preloadSimple('test1234test', 'assets/bell.mp3');
              this.nativeAudio.play('test1234test');
            };
          })

          this.fcm.onTokenRefresh().subscribe(token => {
            // this.storage.set('registrationId', token);
            this.registerDevice(token);
          });

        } catch (error) {

        }
      }
      else if (this.config.notificationType == "onesignal") {
        this.oneSignal.startInit(this.config.onesignalAppId, this.config.onesignalSenderId);
        this.oneSignal.endInit();
        this.oneSignal.getIds().then((data) => {
          this.registerDevice(data.userId);
        })
      }
    }
  }
  requestPushNotificationsPermission() {
    this.afMessaging.requestToken
      .subscribe(
        (token) => {
          this.registerDevice(token);
          // console.log('Permission granted! Save to the server!', token);
        },
        (error) => {
          console.error(error);
        }
      );
  }
  
  //============================================================================================
  //registering device for push notification function
  registerDevice(registrationId) {
    debugger
    //this.storage.get('registrationId').then((registrationId) => {
    // console.log(registrationId);
    let data: { [k: string]: any } = {};
    if (this.customerData.customers_id == null)
      data.customers_id = null;
    else
      data.customers_id = this.customerData.customers_id;
    //	alert("device ready fired");
    let deviceInfo = this.device;
   
    data.device_model = deviceInfo.model;
    data.device_type = deviceInfo.platform;
    data.device_id = registrationId;
    data.device_os = deviceInfo.version;
    data.manufacturer = deviceInfo.manufacturer;
    data.ram = '2gb';
    data.processor = 'mediatek';
    data.location = 'empty';
if(data.device_type!='Android') data.device_type = 'Desktop';
    // alert(JSON.stringify(data));
    this.config.postHttp("registerdevices", data).then(data => {
      //  alert(registrationId + " " + JSON.stringify(data));
    });
    //  });

  }

  showAd() {
    //this.loading.autoHide(2000);
    this.events.publish('showAd');
  }

  toast(msg) {
    this.translateString(msg).then(async (res: string) => {
      const toast = await this.toastCtrl.create({
        message: res,
        duration: 3500,
        position: 'bottom'
      });
      toast.present();
    });
  }
  toastMiddle(msg) {

    this.translateString(msg).then(async (res: string) => {
      let toast = await this.toastCtrl.create({
        message: res,
        duration: 3500,
        position: 'middle'
      });

      toast.present();
    });
  }

  toastWithCloseButton(msg) {

    this.translateString(msg).then(async (res: string) => {
      let toast = await this.toastCtrl.create({
        message: res,
        showCloseButton: true,
        position: 'middle',
        closeButtonText: "X"
      });

      toast.present();
    });
  }


  //categories page

  getCategoriesPageItems(parent) {
    let c = [];
    if (parent == undefined)
      c = this.categories;
    else {
      for (let v of this.allCategories) {
        if (v.parent == parent) {
          c.push(v);
        }
      }
    }
    return c;
  }

  // translation services
  translateString(value) {
    return new Promise(resolve => {
      let v = this.translationListArray[value];
      // console.log(v);
      if (v == undefined)
        v = value;
      resolve(v);
    });
  }
  translateArray(value) {
    return new Promise(resolve => {
      let tempArray = [];
      value.forEach(element => {
        if (this.translationListArray[element] != undefined)
          tempArray[element] = this.translationListArray[element];
        else
          tempArray[element] = element;
      });
      resolve(tempArray);
    });
  }
  //=================================================

  showAlert(text) {
    this.translateArray([text, "ok", "Alert"]).then(async (res) => {
      // console.log(res);
      const alert = await this.alertCtrl.create({
        header: res["Alert"],
        message: res[text],
        buttons: [res["ok"]]
      });
      await alert.present();
    });
  }

  showAlertWithTitle(text, title) {
    this.translateArray([text, "ok", title]).then(async (res) => {
      let alert = await this.alertCtrl.create({
        header: res[title],
        message: res[text],
        buttons: [res["ok"]]
      });
      await alert.present();
    });
  }

  getNameFirstLetter() {
    return this.customerData.first_name.charAt(0);
  }

}
