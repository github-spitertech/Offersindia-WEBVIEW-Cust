
import { Component, ViewChild } from '@angular/core';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { IonInfiniteScroll, NavController, ModalController, NavParams } from '@ionic/angular';
import { ConfigService } from 'src/providers/config/config.service';
import { LoadingService } from 'src/providers/loading/loading.service';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-select-city',
  templateUrl: './select-city.page.html',
  styleUrls: ['./select-city.page.scss'],
})
export class SelectCityPage {
  // @ViewChild('Searchbar') searchBar: Searchbar;
  searchQuery = '';
  items;
  // tslint:disable-next-line: new-parens
  pincodelocality = new Array;
  page;
  constructor(
    public navParams: NavParams,
    public config: ConfigService,
    public loading: LoadingService,
    public httpClient: HttpClient,
    // public navCtrl: NavController,
    public modalCtrl: ModalController,
    public storage: Storage,
    public nav: NavController,
    public shared: SharedDataService,
    // public storage: Storage,
  ) {

    this.shared.currentOpenedModel = this;
    this.initializeItems();
  }

  initializeItems() {
    this.items = this.shared.cityList;
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the searchbar
    const val = ev.target.value;

    // if the value is an empty string don't filter the items
    // tslint:disable-next-line: triple-equals
    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      }
      );
    }
  }
  // close modal
  dismiss() {
    this.dismiss();
    this.shared.currentOpenedModel = null;
  }
  selectCity(c) {
    debugger
    // tslint:disable-next-line: triple-equals
    if (this.navParams.get('page') == 'home/0') {
      this.shared.cityid = c.id;
      this.shared.cityName = c.cityName;
      localStorage.cityId= this.shared.cityid;
      // this.storage.set('cityId', this.shared.cityid);
      // this.storage.set('cityName', this.shared.cityName);

      // tslint:disable-next-line: triple-equals
    } else if (this.navParams.get('page') == 'shipping') {

      this.shared.orderDetails.delivery_city_id = c.id;
      this.shared.orderDetails.delivery_city_name = c.name;
      // tslint:disable-next-line: triple-equals
    } else if (this.navParams.get('page') == 'editShipping') {
      this.shared.tempdata.entry_city_id = c.id;
      this.shared.tempdata.entry_city_name = c.name;
    } else {
      this.shared.orderDetails.billing_city_id = c.id;
      this.shared.orderDetails.billing_city_name = c.name;
      // tslint:disable-next-line: align
    } this.modalCtrl.dismiss();
  }
}
