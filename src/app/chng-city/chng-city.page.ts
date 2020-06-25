import { Component, OnInit } from '@angular/core';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { NavController, ModalController } from '@ionic/angular';
import { SelectCityPage } from '../select-city/select-city.page';

@Component({
  selector: 'app-chng-city',
  templateUrl: './chng-city.page.html',
  styleUrls: ['./chng-city.page.scss'],
})
export class ChngCityPage implements OnInit {


  constructor(public shared: SharedDataService,
    public modalCtrl: ModalController,

              public nav: NavController, ) {
                this.chanecity();
  }

  ngOnInit() {
   
  }

  async chanecity(){
     const modal = await this.modalCtrl.create({ component: SelectCityPage, componentProps: { page: 'home/0' } });
    // rs
    this.nav.navigateForward('/home/0'); 
     return await modal.present();
  }
}
