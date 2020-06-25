import { Component, OnInit, Input, ViewChild, ApplicationRef } from '@angular/core';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { IonInfiniteScroll, NavController, ModalController } from '@ionic/angular';
import { ConfigService } from 'src/providers/config/config.service';
import { LoadingService } from 'src/providers/loading/loading.service';
import { HttpClient } from '@angular/common/http';
import { SelectCityPage } from 'src/app/select-city/select-city.page';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-sliding-tabs',
  templateUrl: './sliding-tabs.component.html',
  styleUrls: ['./sliding-tabs.component.scss'],
})
export class SlidingTabsComponent implements OnInit {
  @ViewChild(IonInfiniteScroll, { static: false }) infinite: IonInfiniteScroll;

  // tslint:disable-next-line: no-input-rename
  @Input('type') type;//product data
  products = new Array;
  vendor = new Array;
  selected = '';
  page = 0;
  pageV = 1;
  httpRunning = true; 
  items: any;
  constructor(
    public shared: SharedDataService,
    public config: ConfigService,
    public loading: LoadingService,
    public httpClient: HttpClient,
    // public navCtrl: NavController,
    public modalCtrl: ModalController,
    public storage: Storage,
    public nav: NavController,

  ) {
    debugger
    this.initialise();
  }
  initialise() {
    return new Promise(async resolve => {
      debugger 
      if (this.shared.cityid != null) {
        this.loading.show();

        this.config.postHttp('getbanners',
          { cityid: this.shared.cityid }).then((data: any) => {
            this.loading.hide();
            this.shared.banners = data.data;
          });
          debugger
        if (this.shared.subCategoriesF.length < 1) {
          // this.changeTab('');
         // this.shared.toast("sliding");
          //this.nav.navigateForward('/categories4/0/0'); 
          // this.navCtrl.push(Categories4Page);
        } else {
          this.changeTab('');
        }
        //  this.getVendors(null) ;
       }
       // else {
      //   const modal = await this.modalCtrl.create({component: SelectCityPage, componentProps: { page: 'home/0' }});
      //   // rs
      //   modal.onDidDismiss().then((dataReturned) => {
      //     debugger
      //     this.httpClient.post(this.config.url + 'getbanners',
      //       { cityid: this.shared.cityid }).subscribe((data: any) => {
      //         this.shared.banners = data.data;
      //         // this.storage.set('cityId', this.shared.cityid);
      //       });
      //     // tslint:disable-next-line: triple-equals
      //     if (this.shared.categoryId == '0' || this.shared.categoryId == undefined) {
      //     this.nav.navigateForward('/categories4/0/0');
      //     } else {
      //       this.changeTab('');
      //     }

      //     //  this.getVendors(null) ;
      //   });
      //   return  modal.present();
      //   // rs

      // }
    });

  }
  getItems(ev: any) {
    // Reset items back to all of the items
    this.items = this.shared.cityList;
    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }
  // getProducts(infiniteScroll) {
  //   this.httpRunning = true;
  //   // tslint:disable-next-line: triple-equals
  //   if (this.page == 0) {this.products = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]; }
  //   let catId: any = this.selected;
  //   // tslint:disable-next-line: triple-equals
  //   if (this.selected == 0) { catId = ''; }
  //   // tslint:disable-next-line: prefer-const
  //   let dat: { [k: string]: any } = {};
  //   dat.customers_id = null;
  //   dat.categories_id = this.selected;
  //   dat.page_number = this.page;

  //   // if (d.type != undefined)
  //   //   data.type = d.type;
  //   dat.language_id = this.config.langId;
  //   dat.currency_code = this.config.currecnyCode;
  //   this.config.postHttp('getallproducts', dat).then((data: any) => {
  //     this.httpRunning = false;

  //     this.infinite.complete();
  //     // tslint:disable-next-line: triple-equals
  //     if (this.page == 0) {
  //       // tslint:disable-next-line: new-parens
  //       this.products = new Array;
  //       // this.loading.hide();
  //     }
  //     // tslint:disable-next-line: triple-equals
  //     if (data.success == 1) {
  //       this.page++;
  //       const prod = data.product_data;
  //       for (const value of prod) {
  //         this.products.push(value);
  //       }
  //     }
  //     // tslint:disable-next-line: triple-equals
  //     if (data.success == 0) { this.infinite.disabled = true; }
  //   });
  //   // // console.log(this.products.length + "   " + this.page);
  // }
// rs
getVendors(infiniteScroll) {

  // this.pageV=0;
  if (this.shared.cityid == null)
    return;
  if (infiniteScroll == null) {
    this.pageV = 1;
  }
  // this.loading.show();
  this.httpRunning = true;
  if (this.pageV == 1) { }
  var dat: { [k: string]: any } = {};
  dat.cities = this.shared.cityid;
  dat.page_number = this.pageV;
  dat.categoryid = this.selected;
  // if (d.type != undefined)
  //   data.type = d.type;
  debugger
  this.httpClient.post(this.config.url + 'shopbyvendorlist', dat).subscribe((data: any) => {
    this.httpRunning = false;
    // // console.log(data.product_data.length + "   " + this.page);
    this.infinite.complete();
    // this.loading.hide();
    if (this.pageV == 1) { this.vendor = new Array; }
    if (data.success == 1) {
      this.pageV++;
      var prod = data.data;
      for (let value of prod) {
        this.vendor.push(value);
  

      }
    }

    if (data.success == 1 && data.data.length == 0) { this.infinite.complete(); }
    if (data.success == 0) { this.infinite.complete() }

  }, (error: any) => {
    this.loading.hide();
    this.httpRunning = false;
  });

}

// end rs
  // changing tab
  changeTab(c) {
    debugger
     // this.infinite.enable(true);
     this.page = 0;
     if (c == '') this.selected = this.shared.categoryId;
     else this.selected = c.id;
     this.getVendors(null);
     // this.getProducts(null);
  }


  ngOnInit() {
    // this.getProducts(null);
  }

}
