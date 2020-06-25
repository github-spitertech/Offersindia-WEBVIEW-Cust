import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Events, IonSlides, ModalController } from '@ionic/angular';
import { NavController, IonContent } from '@ionic/angular';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { ConfigService } from 'src/providers/config/config.service';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { SelectCityPage } from 'src/app/select-city/select-city.page';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {


  @ViewChild(IonContent, { static: false }) content: IonContent;
  @ViewChild('recentSlider', { static: false }) slider: IonSlides;

  segments = "topSeller"//first segment by default 
  scrollTopButton = false;//for scroll down fab 
  //for product slider after banner
  sliderConfig = {
    slidesPerView: this.config.productSlidesPerPage,
    spaceBetween: 0
  }
  selectedRadioGroup: any;
  selectedRadioItem: any;


  constructor(
    public nav: NavController,
    public config: ConfigService,
    public events: Events,
    public router: Router,
    public shared: SharedDataService,
    public modalCtrl: ModalController,

    private activatedRoute: ActivatedRoute) {
    if (this.shared.cityid == null) {
      this.ChangeCity();
    }
    if (this.activatedRoute.snapshot.paramMap.get('catid') == 'All') {
      this.shared.subCategoriesF = [];
      for (let value of this.shared.subCategories) {
        this.shared.subCategoriesF.push(value);
      }
    } else {
      this.shared.categoryId = this.activatedRoute.snapshot.paramMap.get('catid');
      // tslint:disable-next-line: triple-equals
      // if (this.shared.cityid == null) {
      //   this.ChangeCity();
      // } else
      if ( this.shared.categoryId == '0') {
        // this.changeTab('');
        //this.shared.toast("home");

      this.nav.navigateForward('/categories4/0/0');
        // this.navCtrl.push(Categories4Page);
      } else {
        this.shared.subCategoriesF = [];
        for (let value of this.shared.subCategories) {
          if (value.parent_id == this.shared.categoryId) { this.shared.subCategoriesF.push(value); }
        }
      }
    }
  }
  async ChangeCity() {
    const modal = await this.modalCtrl.create({ component: SelectCityPage, componentProps: { page: 'home/0' } });
    // rs
    modal.onDidDismiss().then((dataReturned) => {
      debugger
      this.config.postHttp('getbanners',
        { cityid: this.shared.cityid }).then((data: any) => {
          this.shared.banners = data.data;

        });
      // tslint:disable-next-line: triple-equals
      // this.nav.navigateForward('/categories4/0/0');
    });
    return modal.present();
    // rs

  }
  setMethod(d) {
    // console.log(d);
  }
  ngOnInit() {
  }
  ionViewDidEnter() {
    this.shared.hideSplashScreen();
  }


  // For FAB Scroll
  onScroll(e) {
    if (e.detail.scrollTop >= 500) {
      this.scrollTopButton = true;
    }
    if (e.detail.scrollTop < 500) {
      this.scrollTopButton = false;
    }
  }
  // For Scroll To Top Content
  scrollToTop() {
    this.content.scrollToTop(700);
    this.scrollTopButton = false;
  }
  openProducts(value) {
    this.nav.navigateForward("/products/0/0/" + value);
  }
  openModal(){
    this.nav.navigateForward("/notification");

  }
}
