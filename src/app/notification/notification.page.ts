import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { ConfigService } from 'src/providers/config/config.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage {
  notify : any=[];
  page=0;
    constructor(public navCtrl: NavController, 
                public shared : SharedDataService,
      public httpClient : HttpClient,
                public config : ConfigService) {
                  this.ionViewDidLoad();
    }
  
    ionViewDidLoad() {
      debugger
      // console.log('ionViewDidLoad NotificationPage');
      var dat1: { [k: string]: any } = {};
      dat1.vendorid = this.shared.customerData.empid;
      // dat1.vendorid = 0;
      dat1.page_number = this.page; 
      dat1.customerid=this.shared.customerData.customers_id;
      this.config.postHttp('customernotification', dat1).then((data: any) => {
        if (data.success == 1) {
          this.notify = data.data;
        } else {
          this.shared.toast(data.message);
        }
      });
    }
    onDelete(id){
      
      var dat: { [k: string]: any } = {};
      
      dat.id = id;
      this.config.postHttp('deletenotification', dat).then((data: any) => {
        if (data.success == 1) {
          this.ionViewDidLoad();
        } else {
          this.shared.toast(data.message);
        }
  
      });
    }
  
  
  }
  
