import { Component, OnInit, ApplicationRef } from '@angular/core';
import { LoadingService } from 'src/providers/loading/loading.service';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';

import { ConfigService } from 'src/providers/config/config.service';
import { NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage {

  search;
  searchResult = [];
  showCategories = true;
  type="";
  constructor( private activatedRoute: ActivatedRoute,
    public navCtrl: NavController,
    public config: ConfigService,
    public http: HttpClient,
    public loading: LoadingService,
    public shared: SharedDataService,
  ) {
    //debugger
    
    this.type= this.activatedRoute.snapshot.paramMap.get('type');
    if(this.type==null)
    {
      this.type="vendors";
    }
  }

  onChangeKeyword = function (e) {
    //debugger
    if (this.search != undefined || this.search.length<3) {
      if (this.search == null || this.search == '' ) {
        // this.shared.toast("Please enter something ");
        this.searchResult=[];
        return 0;
      }
    }
    else {
      this.shared.toast("Please enter something ");
      return 0;
    }
    debugger
    if(this.type=='products'){
       //debugger
      this.httpClient.post(this.config.url + 'productsearch', 
      { 'productname': this.search,'vendorid': this.shared.vendorData.vendorid,'categoryId':this.shared.categoryId }).subscribe((data: any) => {
        // this.loading.hide();
        if (data.status) {
          this.searchResult = data.data;
          this.showCategories = false;
        }
        if (!data.status) {
          this.searchResult=[];
          this.shared.toast(data.message);
        }
      }); 
     }
     else{
      this.config.postHttp('vendorsearch', 
      { 'vendorname': this.search,'cityid': this.shared.cityid }).then((data: any) => {
        // this.loading.hide();
        if (data.status) {
          this.searchResult = data.data;
          this.showCategories = false;

        }
        if (!data.status) {
          this.searchResult=[];
          this.shared.toast(data.message);
        }
      });
     }
    //// console.log(this.search);
    // if (search != undefined) {
    //rchResult = [];
    //  }
   
    // //debugger
    // this.loading.show();
  }
  
 
  getSearchData = function () {
    
    if (this.search != undefined) {
      if (this.search == null || this.search == '') {
        this.shared.toast("Please enter something ");
        return 0;
      }
    }
    else { 
      this.shared.toast("Please enter something ");
      return 0;
    }
    this.loading.show();
    this.httpClient.post(this.config.url + 'getsearchdata', 
    { 'searchValue': this.search, 'cityid': this.shared.cityid}).subscribe((data: any) => {
      this.loading.hide();
      if (data.status) {
        this.searchResult = data.vendor_data;
        this.showCategories = false;
      }
      if (!data.status) {
        this.shared.toast(data.message);
      }
    });
    // this.httpClient.post(this.config.url + 'getsearchdata', 
    // { 'searchValue': this.search, 'language_id': this.config.langId }).subscribe((data: any) => {
    //   this.loading.hide();
    //   if (data.success == 1) {
    //     this.searchResult = data.product_data;
    //     this.showCategories = false;
    //   }
    //   if (data.success == 0) {
    //     this.shared.toast(data.message);
    //   }
    // });
  };

  openProducts(id, name) {
    this.navCtrl.navigateForward("/products/" + id + "/" + name + "/0");
  }
  openCart() {
     
    this.navCtrl.navigateForward("/cart");
  }
}
