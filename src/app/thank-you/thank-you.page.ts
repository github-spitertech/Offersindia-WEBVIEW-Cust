import { Component, OnInit } from '@angular/core';
import { NavController, Events } from '@ionic/angular';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { ConfigService } from 'src/providers/config/config.service';
import { LoadingService } from 'src/providers/loading/loading.service';

@Component({
  selector: 'app-thank-you',
  templateUrl: './thank-you.page.html',
  styleUrls: ['./thank-you.page.scss'],
})
export class ThankYouPage implements OnInit {


  constructor(
    public navCtrl: NavController,
    public shared: SharedDataService,
    public config: ConfigService,
    public events: Events,
    public loading: LoadingService,

  ) {
    // this.array = this.navCtrl.getViews();

  }
  rate=0;
  openHome() {
    this.events.publish("openHomePage");
  }
  openOrders() { this.navCtrl.navigateRoot("/my-orders"); }
  clickRate(val){

    this.rate=val;
    var dat: { [k: string]: any } = {};
     //debugger
         dat.ratingvalue = this.rate;
         dat.customerid = this.shared.customerData.customers_id;
         dat.vendorid = this.shared.vendorData.vendorid;
         this.loading.show();
         this.config.postHttp('rating', dat).then((data:any) => {
          this.loading.hide();
          if (data.success == 1) {
            }
        });
      }
  ngOnInit() {
  }

}
