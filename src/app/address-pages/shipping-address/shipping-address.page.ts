import { Component, OnInit } from '@angular/core';


import { ConfigService } from 'src/providers/config/config.service';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { ModalController, NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { LoadingService } from 'src/providers/loading/loading.service';
import { UserAddressService } from 'src/providers/user-address/user-address.service';
import { SelectCountryPage } from 'src/app/modals/select-country/select-country.page';
import { SelectZonesPage } from 'src/app/modals/select-zones/select-zones.page';
import { SelectCityPage } from 'src/app/select-city/select-city.page';
@Component({
  selector: 'app-shipping-address',
  templateUrl: './shipping-address.page.html',
  styleUrls: ['./shipping-address.page.scss'],
})
export class ShippingAddressPage implements OnInit {
  public isDefaultAdd=false;
  public IsPincodeValid = false;
  localityList: any;
  isLoadAddress:false;
  constructor(
    public navCtrl: NavController,
    public config: ConfigService,
    public http: HttpClient,
    public shared: SharedDataService,
    public modalCtrl: ModalController,
    public loading: LoadingService,
    public userAddress: UserAddressService, 
    ) {
    // this.loading.show();
    var dat: { [k: string]: any } = {};
    dat.customers_id = this.shared.customerData.customers_id;
    this.config.postHttp('getalladdress', dat).then((data: any) => {
      this.loading.hide();
      if (data.success == 1) {
        var allShippingAddress = data.data;
        for (let value of allShippingAddress) {
          if (value.default_address != null || allShippingAddress.length == 1) {
            this.isDefaultAdd=true;
            this.shared.orderDetails.tax_zone_id = value.zone_id;
            this.shared.orderDetails.delivery_firstname = value.firstname;
            this.shared.orderDetails.delivery_lastname = value.lastname;
            this.shared.orderDetails.delivery_state = value.state; 
            this.shared.orderDetails.delivery_city_name = value.city;
            this.shared.orderDetails.delivery_postcode = value.postcode;
            this.shared.orderDetails.delivery_zone = value.zone_name;
            this.shared.orderDetails.delivery_country = value.country_name;
            this.shared.orderDetails.delivery_country_id = value.countries_id;
            this.shared.orderDetails.delivery_street_address = value.street;
            this.shared.orderDetails.delivery_city_id     =value.city_id;
            this.shared.orderDetails.delivery_country_code=value.country_code;
            this.shared.orderDetails.delivery_delivery    =value.entry_delivery;
            this.shared.orderDetails.delivery_locality    =value.entry_locality;
            this.shared.orderDetails.delivery_phone       =value.entry_phone;
            this.shared.orderDetails.delivery_pincode_id  =value.pincode_id;
            this.shared.orderDetails.delivery_country = "India";//c.countries_name;
            this.shared.orderDetails.delivery_country_code = "99";//c.countries_id;
            this.shared.orderDetails.delivery_country_id ="99";// c.countries_id;
            this.pincodechange(null);
            //this.shared.orderDetails.delivery_telephone = $rootScope.customerData.customers_telephone;
            // if ($rootScope.zones.length == 0)
            if (value.zone_code == null) {
              //  // console.log(c);
              this.shared.orderDetails.delivery_zone = 'other';
              this.shared.orderDetails.delivery_state = 'other';
              this.shared.orderDetails.tax_zone_id = null;
            }
          }
        }
      }
      if (data.success == 0) { }
    });

    this.shared.orderDetails.delivery_phone = this.shared.customerData.customers_telephone;
  }
  pincodechange(event) {
     
    if (("" + this.shared.orderDetails.delivery_postcode).length == 6) {
      this.IsPincodeValid = true;
      var dat: { [k: string]: any } = {};
      dat.pincode = this.shared.orderDetails.delivery_postcode;// event._value;
      // this.loading.show();
      this.config.postHttp('pincodelocality', dat).then((data: any) => 
      {
        this.loading.hide();
        if (data.success == 1) {
          this.localityList = data.data;
          // this.shared.orderDetails.delivery_delivery = data.data.delivery;
        }
        else {
          this.localityList = [];
          this.shared.orderDetails.delivery_delivery ="Not Deliveryable";
        }
      }
      ,error=>{
        this.loading.hide();
      }
      );

    }
    else {
      this.IsPincodeValid = false;
    }

  }
  async selectLocalityPage() {
    debugger
    if( this.localityList.length>0){
    let modal = await this.modalCtrl.create({
      component: SelectCountryPage,
      componentProps: { page: 'shipping',localityList: this.localityList  }
    });

    return await modal.present();
  }else
  {
    this.shared.showAlertWithTitle("Not found locality.", "Warning");
  }
  }

  async selectZonePage() {

    let modal = await this.modalCtrl.create({
      component: SelectZonesPage,
      componentProps: { page: 'shipping', id: this.shared.orderDetails.delivery_country_id }
    });

    return await modal.present();
  }
  submit() {
    this.navCtrl.navigateForward("billing-address");
  }
  
  async selectCityPage() {
    debugger
    let modal = await this.modalCtrl.create({
      component: SelectCityPage,
      componentProps: { page: 'shipping', id: this.shared.orderDetails.delivery_country_id }
    });

    return await modal.present();
 
  }
 

  ngOnInit() {
  }


}
