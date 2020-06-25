import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';

import { NavController, NavParams, ModalController, Events } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/providers/config/config.service';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { LoadingService } from 'src/providers/loading/loading.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-vendorshops',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './vendorshops.component.html',
  styleUrls: ['./vendorshops.component.scss'],
})
export class VendorshopsComponent implements OnInit {

  @Input('data') v;//product data
  @Input('type') type;
  // @Output() someEvent = new EventEmitter();

  expired = false;
  is_upcomming = false;
  constructor(
    public shared: SharedDataService,
    public config: ConfigService,
    public loading: LoadingService,
    public nav: NavController,
    // public navParams: NavParams,
    public modalCtrl: ModalController,
    public events: Events,
    public httpClient: HttpClient,
    public storage: Storage,
  ) { }

  pDiscount() {
    var rtn = "";
    var p1 = parseInt(this.v.products_price);
    // tslint:disable-next-line: radix
    var p2 = parseInt(this.v.discount_price);
    if (p1 == 0 || p2 == null || p2 == undefined || p2 == 0) { rtn = ""; }
    var result = Math.abs((p1 - p2) / p1 * 100);
    result = parseInt(result.toString());
    if (result == 0) { rtn = "" }
    rtn = result + '%';
    return rtn;
  }
  shopnowclick(v){
     debugger
     this.shared.vendorData=v;
     this.storage.set('cartVendor', this.shared.vendorData);

    // console.dir(this.shared.vendorData);
     this.nav.navigateForward('/products/0/0/newest');
    // this.router.navigateByUrl("/products/" + v.id + "/" + v.name + "/newest");
      // this.navCtrl.push(ProductsPage,{});
      //debugger
     this.storage.set('vendorData', this.shared.vendorData);
    // this.shared.vendorData.push(v);
     if(this.shared.categoryId==null || this.shared.categoryId==undefined) {
    this.getCategories(v.vendorid);
    }
  }
  getCategories(vendorid){
    //  this.loading.show();
      var dat: { [k: string]: any } = {};
     
      dat.language_id = this.config.langId;
     dat.vendorid=vendorid;
     //debugger
      
      this.httpClient.post(this.config.url + 'allcategories', dat).subscribe((data: any) => {
       this.loading.hide();
  
       this.shared.subCategoriesF = data.data;
      }, (error: any) => {
        // //debugger
      });
    }
  ngOnInit() {}

}
