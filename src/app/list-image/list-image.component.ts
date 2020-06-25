import { Component, OnInit } from '@angular/core';
import { NavParams, NavController, ModalController, Platform, ActionSheetController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { TranslateService } from '@ngx-translate/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ConfigService } from 'src/providers/config/config.service';
import { LoadingService } from 'src/providers/loading/loading.service';
import { LoginPage } from '../modals/login/login.page';
import { AddressesPage } from '../address-pages/addresses/addresses.page';
import { SelectCountryPage } from '../modals/select-country/select-country.page';
import { SelectCityPage } from '../select-city/select-city.page';
import { SelectZonesPage } from '../modals/select-zones/select-zones.page';
@Component({
  selector: 'app-list-image',
  templateUrl: './list-image.component.html',
  styleUrls: ['./list-image.component.scss'],
})
export class ListImageComponent {
  public IsPincodeValid = false;
  localityList: any;
  image = null;
  localpickup = true;
  shipping = false
  public orderDetail = {
    tax_zone_id: "",
    delivery_firstname: "",
    delivery_lastname: "",
    delivery_state: "",
    delivery_city_id: "",
    delivery_city_name: "",
    delivery_zone: "",
    delivery_country: "India",
    delivery_country_id: "99",
    delivery_street_address: "",
    delivery_country_code: "",
    delivery_phone: "",
    delivery_pincode_id: "",
    delivery_postcode: "",
    delivery_locality: "",
    delivery_delivery: "",

    orderDetail: "",
    customers_name: "",
    customers_city: "",
    delivery_name: "",
    email: "",
    customers_telephone: "",
    itemimage: "",
    vendorid: "",
    customerid: "",
    shipping_method: ""
  }
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public config: ConfigService,
    public shared: SharedDataService,
    public loading: LoadingService,
    public modalCtrl: ModalController,
    private camera: Camera,
    public platform: Platform,
    public translate: TranslateService,
    public actionSheetCtrl: ActionSheetController, ) {

  }

  openActionSheet() {
    debugger
    this.translate.get(["Camera", "Gallery", "Cancel", "Choose"]).subscribe(async (res) => {
      const actionSheet = await this.actionSheetCtrl.create({
        buttons: [
          {
            text: res["Camera"],
            icon: 'camera',
            handler: () => {
              this.openCamera("camera");
            }
          }, {
            text: res["Gallery"],
            icon: 'image',
            handler: () => {
              this.openCamera("gallery");
            }
          }, {
            text: res["Cancel"],
            icon: 'close',
            role: 'cancel',
            handler: () => {
            }
          }
        ]
      });
      actionSheet.present();
    });
  }
  openCamera(type) {
    debugger
    // this.loading.autoHide(1000);

    let source = this.camera.PictureSourceType.CAMERA;
    if (type == 'gallery')
      source = this.camera.PictureSourceType.PHOTOLIBRARY;

    const options: CameraOptions = {
      quality: 100,
      sourceType: source,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      allowEdit: true,
      targetWidth: 563,
      targetHeight: 1000,
      saveToPhotoAlbum: false,
      correctOrientation: true
    }

    this.platform.ready().then(() => {
      this.camera.getPicture(options).then((imageData) => {
        debugger
        this.image = 'data:image/jpeg;base64,' + imageData;
      }, (err) => {
        debugger
      });
    });
  }

  pincodechange(event) {

    if (("" + this.orderDetail.delivery_postcode).length == 6) {
      this.IsPincodeValid = true;
      var dat: { [k: string]: any } = {};
      dat.pincode = this.orderDetail.delivery_postcode;// event._value;
      this.loading.show();
      this.config.postHttp('pincodelocality', dat).then((data: any) => {
        this.loading.hide();
        if (data.success == 1) {
          this.localityList = data.data;
          // this.orderDetail.delivery_delivery = data.data.delivery;
        }
        else {
          this.localityList = [];
        }
      }
        , error => {
          this.loading.hide();
        }
      );

    }
    else {
      this.IsPincodeValid = false;
    }

  }

  selectShipping(input) {
    if (input == "shipping") {
      this.shipping = true;
      this.localpickup = false;
    } else {
      this.shipping = false;
      this.localpickup = true;
    }
    this.orderDetail.shipping_method = input;// data.name + '(' + data.shipping_method + ')';
    // // console.log(this.shared.orderDetails);
  }
  //rrs 

  async submit() {
    if (this.shared.customerData.customers_id == null || this.shared.customerData.customers_id == undefined) {
      let modal = await this.modalCtrl.create({
        component: LoginPage
      });
      return await modal.present();
    }
    this.orderDetail.customerid = this.shared.customerData.customers_id;
    // this.orderDetail.customers_name = this.shared.orderDetails.delivery_firstname + " " + this.shared.orderDetails.delivery_lastname;
    // this.orderDetail.customers_city =this.shared.customerData.customers_city;

    // this.orderDetail.delivery_name = this.shared.orderDetails.billing_firstname + " " + this.shared.orderDetails.billing_lastname;
    // this.orderDetail.email = this.shared.customerData.email;
    // this.orderDetail.customers_telephone = this.shared.customerData.customers_telephone;
    this.orderDetail.itemimage = this.image;
    this.orderDetail.vendorid = this.shared.vendorData.vendorid;
    // this.orderDetail.delivery_locality = this.shared.orderDetails.delivery_locality;
    // this.orderDetail.delivery_city_name = this.shared.orderDetails.delivery_city_name;
    // this.orderDetail.shipping_method=this.shared.orderDetails.shipping_method
    // console.log(JSON.stringify(this.orderDetail));
    // rrs test

    this.loading.show();
    var dat: { [k: string]: any } = {};

    dat.customers_id = this.shared.customerData.customers_id;
    //debugger
    let flag = false;

    this.config.postHttp('getalladdress', dat).then(async (data: any) => {
      this.loading.hide();
      //debugger
      if (data.success == 1) {
        var allShippingAddress = data.data;
        for (let value of allShippingAddress) {
          if (value.default_address != null || allShippingAddress.length == 1) {
            flag = true;
            this.loading.autoHide(100000);

            this.config.postHttp('additemlist', this.orderDetail).then((data: any) => {
              this.loading.hide();
              if (data.success == 1) {
                this.navCtrl.navigateRoot("thank-you");
                this.modalCtrl.dismiss();
              }
              if (data.success == 0) { this.shared.toast(data.message); }
            }, err => {
              this.loading.hide();
            });
          }

        }
        // //debugger
        if (!flag) {
          this.shared.toast("Please add customer address.");
          const modal = await this.modalCtrl.create({ component: AddressesPage });

          // this.navCtrl.push(MyShippingAddressesPage,"listImage");
        }
      }
      if (data.success == 0) {
        if (data.message == "Addresses are not added yet.") {
          this.shared.toast("Please add customer address.");
          const modal = await this.modalCtrl.create({ component: AddressesPage });

          // this.navCtrl.push(MyShippingAddressesPage,"listImage");
        }
      }
    });
    // rrs test stop


  }
  async selectLocalityPage() {
    if (this.localityList.length > 0) {
      // let modal = this.modalCtrl.create(SelectCountryPage, { page: 'shipping', localityList: this.localityList });
      // modal.present();
      const modal = await this.modalCtrl.create({ component: SelectCountryPage, componentProps: { page: 'shipping', localityList: this.localityList } });
      modal.present();
    } else {
      this.shared.toast("Not found locality.");
    }
  }
  async selectCityPage() {
    // let modal = this.modalCtrl.create(SelectCityPage, { page: 'shipping' });
    const modal = await this.modalCtrl.create({ component: SelectCityPage, componentProps: { page: 'shipping' } });

    modal.present();
  }
  async selectZonePage() {
    const modal = await this.modalCtrl.create({ component: SelectZonesPage, componentProps: { page: 'shipping', id: this.shared.orderDetails.delivery_country_id } });

    modal.present();
  }

}

