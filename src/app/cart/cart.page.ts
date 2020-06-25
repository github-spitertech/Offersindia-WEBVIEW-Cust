import { Component, OnInit, ApplicationRef } from '@angular/core';


import { ConfigService } from 'src/providers/config/config.service';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { NavController, Events, ModalController, ActionSheetController } from '@ionic/angular';
import { LoadingService } from 'src/providers/loading/loading.service';
import { CouponService } from 'src/providers/coupon/coupon.service';
import { Storage } from '@ionic/storage';
import { LoginPage } from '../modals/login/login.page';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  total: any;
  constructor(
    public navCtrl: NavController,
    public shared: SharedDataService,
    public config: ConfigService,
    public loading: LoadingService,
    private storage: Storage,
    public events: Events,
    public modalCtrl: ModalController,
    private applicationRef: ApplicationRef,
    public couponProvider: CouponService,
    public actionSheetCtrl: ActionSheetController,
  ) {
  }
  totalPrice() {
    var price = 0;
    for (let value of this.shared.cartProducts) {
      var pp = value.final_price * value.customers_basket_quantity;
      price = price + pp;
    }
    this.total = price;
  };
  getSingleProductDetail(id) {
    this.loading.show();

    var dat: { [k: string]: any } = {};
    if (this.shared.customerData != null)
      dat.customers_id = this.shared.customerData.customers_id;
    else
      dat.customers_id = null;
    dat.products_id = id;
    dat.language_id = this.config.langId;
    this.config.postHttp('getallproducts', dat).then((data:any) => {
      this.loading.hide();
      if (data.success == 1) {
        this.shared.singleProductPageData.push(data.product_data[0]);
        this.navCtrl.navigateForward("product-detail/" + data.product_data[0].products_id);
    
      }
    });
  }
  removeCart(id) {
    this.shared.removeCart(id);
    this.totalPrice();
  }
  qunatityPlus = function (q) {
    q.customers_basket_quantity++;
    q.subtotal = q.final_price * q.customers_basket_quantity;
    q.total = q.subtotal;
    if (q.customers_basket_quantity > q.defaultStock) {
      q.customers_basket_quantity--;
      q.subtotal = q.final_price * q.customers_basket_quantity;
      q.total = q.subtotal;
      this.shared.toast('Product Quantity is Limited!', 'short', 'center');
    }
    this.totalPrice();
    this.shared.cartTotalItems();
    this.storage.set('cartProducts', this.shared.cartProducts);
  }
  //function decreasing the quantity
  qunatityMinus = function (q) {
    if (q.customers_basket_quantity == 1) {
      return 0;
    }
    q.customers_basket_quantity--;
    q.subtotal = q.final_price * q.customers_basket_quantity;
    q.total = q.subtotal;
    this.totalPrice();

    this.shared.cartTotalItems();
    this.storage.set('cartProducts', this.shared.cartProducts);
  }
  ionViewDidLoad() {
    this.totalPrice()
  }
  async proceedToCheckOut() {

    if (this.shared.customerData.customers_id == null || this.shared.customerData.customers_id == undefined) {
      let modal = await this.modalCtrl.create({
        component: LoginPage
      });
      return await modal.present();
    }
    else {
      this.navCtrl.navigateForward("/shipping-address");
    }
  }
  openProductsPage() {
    this.navCtrl.navigateForward("/products/0/0/newest");
  }
  ionViewWillEnter() {
    this.totalPrice()
  }

  ngOnInit() {
  }

}
