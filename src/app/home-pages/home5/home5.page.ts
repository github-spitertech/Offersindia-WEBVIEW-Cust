import { Component, OnInit } from '@angular/core';
import { NavController, Events } from '@ionic/angular';
import { ConfigService } from 'src/providers/config/config.service';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';

@Component({
  selector: 'app-home5',
  templateUrl: './home5.page.html',
  styleUrls: ['./home5.page.scss'],
})
export class Home5Page implements OnInit {

  constructor(
    public nav: NavController,
    public config: ConfigService,
    public events: Events,
    public shared: SharedDataService,
  ) {

  }
  ionViewDidEnter() {
    this.shared.hideSplashScreen();
  }
  openSubCategories(parent) {
    let count = 0;
    for (let value of this.shared.allCategories) {
      if (parent.id == value.parent_id) count++;
    }
    if (count != 0)
      this.nav.navigateForward("/categories/" + parent.id + "/" + parent.name);
    else
      this.nav.navigateForward("/products/" + parent.id + "/" + parent.name + "/newest");
  }
  ngOnInit() {
  }

}
