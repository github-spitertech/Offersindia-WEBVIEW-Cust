import { Component, OnInit, ApplicationRef } from '@angular/core';
import { ConfigService } from 'src/providers/config/config.service';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { ModalController, NavController } from '@ionic/angular';
import { SelectCountryPage } from 'src/app/modals/select-country/select-country.page';
import { SelectZonesPage } from 'src/app/modals/select-zones/select-zones.page';
import { SelectCityPage } from 'src/app/select-city/select-city.page';
@Component({
  selector: 'app-billing-address',
  templateUrl: './billing-address.page.html',
  styleUrls: ['./billing-address.page.scss'],
})
export class BillingAddressPage implements OnInit {

  defaultAddress = true;
  constructor(
    public shared: SharedDataService,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    private applicationRef: ApplicationRef,
  ) {
    this.setAddress(true);
  }

  setAddress(value) {
    if (value == true) {
      this.shared.orderDetails.billing_firstname = this.shared.orderDetails.delivery_firstname;
      this.shared.orderDetails.billing_lastname = this.shared.orderDetails.delivery_lastname;
      this.shared.orderDetails.billing_state = this.shared.orderDetails.delivery_state;
      this.shared.orderDetails.billing_city_name = this.shared.orderDetails.delivery_city_name;
      this.shared.orderDetails.billing_postcode = this.shared.orderDetails.delivery_postcode;
      this.shared.orderDetails.billing_zone = this.shared.orderDetails.delivery_zone;
      this.shared.orderDetails.billing_phone = this.shared.orderDetails.delivery_phone;
      // this.shared.orderDetails.billing_country_id = this.shared.orderDetails.delivery_country_id;
      this.shared.orderDetails.billing_street_address = this.shared.orderDetails.delivery_street_address;
    } else {
      this.shared.orderDetails.billing_firstname = '';
      this.shared.orderDetails.billing_lastname = '';
      this.shared.orderDetails.billing_state = '';
      this.shared.orderDetails.billing_city_name = "";
      this.shared.orderDetails.billing_postcode = '';
      this.shared.orderDetails.billing_zone = '';
      // this.shared.orderDetails.billing_country = '';
      // this.shared.orderDetails.billing_country_id = '';
      this.shared.orderDetails.billing_street_address = '';
    }
  }
  submit() {
    this.navCtrl.navigateForward("shipping-method");
    this.applicationRef.tick();
  }
// rs


async selectLocalityPage() {
  let modal = await this.modalCtrl.create({
    component: SelectCountryPage,
    componentProps: { page: 'billing' }
  });
  return await modal.present();
}

async selectCityPage() {
  let modal = await this.modalCtrl.create({
    component: SelectCityPage,
    componentProps: { page: 'billing' }
  });
  return await modal.present();
}
// rs


  async selectZonePage() {
    let modal = await this.modalCtrl.create({
      component: SelectZonesPage,
      componentProps: { page: 'billing', id: this.shared.orderDetails.billing_country_id }
    });
    return await modal.present();
  }

  ngOnInit() { }

}
