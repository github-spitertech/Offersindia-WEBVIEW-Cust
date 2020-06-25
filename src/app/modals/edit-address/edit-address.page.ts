import { Component, OnInit } from '@angular/core';
import { Events, ModalController, NavParams } from '@ionic/angular';
import { ConfigService } from 'src/providers/config/config.service';
import { LoadingService } from 'src/providers/loading/loading.service';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { SelectZonesPage } from '../select-zones/select-zones.page';
import { SelectCountryPage } from '../select-country/select-country.page';
import { SelectCityPage } from 'src/app/select-city/select-city.page';

@Component({
  selector: 'app-edit-address',
  templateUrl: './edit-address.page.html',
  styleUrls: ['./edit-address.page.scss'],
})
export class EditAddressPage implements OnInit {
  shippingData: { [k: string]: any } = {};
  data;
  type = 'update';
  localityList: any;
  IsPincodeValid: boolean;
  constructor(
    public events: Events,
    public config: ConfigService,
    public modalCtrl: ModalController,
    public loading: LoadingService,
    public shared: SharedDataService,
    public navParams: NavParams,
  ) { 

    this.data = navParams.get('data');
    this.type = navParams.get('type');

    if (this.type != 'add') {
      this.shippingData.entry_firstname = this.data.firstname;
      this.shippingData.entry_lastname = this.data.lastname;
      this.shippingData.entry_street_address = this.data.street;
      this.shippingData.entry_country_name = this.data.country_name;
      this.shippingData.entry_zone = this.data.zone_name; 
      this.shippingData.entry_postcode = this.data.postcode;
      this.shippingData.entry_country_id = this.data.countries_id;
      this.shippingData.entry_address_id = this.data.address_id;
      this.shippingData.entry_city = this.data.city;
      this.shippingData.entry_zone_id = this.data.zone_id;
      this.shippingData.entry_state = this.data.state;
      this.shippingData.suburb = this.data.suburb;
      this.shippingData.address_id = this.data.address_id;
      this.shippingData.entry_locality = this.data.entry_locality;
      this.shippingData.entry_city_name = this.data.city;
      this.shippingData.entry_phone = this.data.entry_phone;
      
      this.pincodechange(null);
    }
  }
  pincodechange(event) {
     
    if (("" + this.shippingData.entry_postcode).length == 6) {
      this.IsPincodeValid = true;
      var dat: { [k: string]: any } = {};
      dat.pincode = this.shippingData.entry_postcode;// event._value;
      this.loading.show();
      this.config.postHttp('pincodelocality', dat).then((data: any) => 
      {
        this.loading.hide();
        if (data.success == 1) {
          this.localityList = data.data;
          // this.shared.orderDetails.delivery_delivery = data.data.delivery;
        }
        else {
          this.localityList = [];
          this.shippingData.entry_delivery ="Not Deliveryable";
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
  async selectCountryPage() {
    let modal = await this.modalCtrl.create({
      component: SelectCountryPage,
      componentProps: { page: 'editShipping' }
    });
    modal.onDidDismiss().then(() => {
      this.updateCountryZone();
    })
    return await modal.present();
  }
  async selectZonePage() {

    let modal = await this.modalCtrl.create({
      component: SelectZonesPage,
      componentProps: { page: 'editShipping', id: this.shippingData.entry_country_id }
    });
    modal.onDidDismiss().then(() => {
      this.updateCountryZone();
    })
    return await modal.present();
  }
  //close modal
  dismiss() {
    this.modalCtrl.dismiss();
  }
  async selectLocalityPage() {
    if( this.localityList.length>0){
      // tslint:disable-next-line: max-line-length
      const modal = await this.modalCtrl.create({component: SelectCountryPage, componentProps: { page: 'editShipping' ,localityList: this.localityList}});
      // rs
      modal.onDidDismiss().then((dataReturned) => {
       
      this.shippingData.entry_country_id =this.shared.tempdata.entry_country_id   ;
      this.shippingData.entry_country_name  =this.shared.tempdata.entry_country_name ;
      this.shippingData.entry_country_code =this.shared.tempdata.entry_country_code ;
      this.shippingData.entry_pincode_id =this.shared.tempdata.entry_pincode_id   ;
      this.shippingData. entry_postcode =this.shared.tempdata.entry_postcode     ;
      this.shippingData.entry_locality =this.shared.tempdata.entry_locality     ;
      this.shippingData.entry_delivery  =this.shared.tempdata.entry_delivery     ;
                   
    })
    modal.present();
    }else
    {
      this.shared.showAlertWithTitle("Not found locality.", "Warning");
    }
  }
  async selectCityPage() {
      const modal = await this.modalCtrl.create({component: SelectCityPage, componentProps: { page: 'editShipping' }});
      // rs
      modal.onDidDismiss().then((dataReturned) => {
      this.shippingData.entry_city_id=this.shared.tempdata.entry_city_id ;
      this.shippingData.entry_city_name=this.shared.tempdata.entry_city_name ;
    });
    modal.present();
  }
  //============================================================================================  
  //adding shipping address of the user
  addShippingAddress = function (form) {
    this.loading.show();
    this.shippingData.customers_id = this.shared.customerData.customers_id;
    var dat = this.shippingData;
    dat.entry_city=dat.entry_city_name;
    
    dat.entry_state = dat.delivery_zone;
    dat.entry_zone = dat.delivery_zone; 
    // //debugger
    this.config.postHttp('addshippingaddress', dat).then((data:any) => {
      this.loading.hide();
       
      this.dismiss();
      this.shared.toast(data.message);
    }, function (response) {
      this.loading.hide();
      // // console.log(response);
    });
  };
  //============================================================================================  
  //updating shipping address of the user
  updateShippingAddress = function (form, id) {
    this.loading.show();
    this.shippingData.customers_id = this.shared.customerData.customers_id;
    var dat = this.shippingData;
    dat.entry_state = dat.delivery_zone;
    dat.entry_zone = dat.delivery_zone;
    this.config.postHttp('updateshippingaddress', dat).then((data:any) => {
      this.loading.hide();
      if (data.success == 1) {
        this.dismiss();
        this.shared.toast(data.message);
      }
    }, function (response) {
      this.loading.hide();
      // // console.log(response);
    });

  };
  updateCountryZone() {
    // // console.log(this.shared.tempdata.entry_country_id);
    if (this.shared.tempdata.entry_country_id != undefined) {

      this.shippingData.entry_country_id = this.shared.tempdata.entry_country_id;
      this.shippingData.entry_country_name = this.shared.tempdata.entry_country_name;
      this.shippingData.entry_country_code = this.shared.tempdata.entry_country_code;
      this.shippingData.entry_zone = this.shared.tempdata.entry_zone;

    }
    if (this.shared.tempdata.entry_zone != undefined) {
      this.shippingData.entry_zone = this.shared.tempdata.entry_zone;
      this.shippingData.entry_zone_id = this.shared.tempdata.entry_zone_id;
    }
  }

  ngOnInit() {
  }

}
