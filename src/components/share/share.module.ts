import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
//for home banner
import { BannerComponent } from '../banner/banner.component';
//for home footer segment

// for product
import { ProductComponent } from '../product/product.component';
//for sliding tab
import { SlidingTabsComponent } from '../sliding-tabs/sliding-tabs.component';
//for featrued product scrolling
import { ScrollingFeaturedProductsComponent } from '../scrolling-featured-products/scrolling-featured-products.component';
//for categories
import { CategoriesComponent } from '../categories/categories.component';
import { PipesModule } from 'src/pipes/pipes.module';
import { TimerComponent } from '../timer/timer.component';
import { VendorshopsComponent } from 'src/app/vendorshops/vendorshops.component';
import { RatingComponent } from 'src/app/rating/rating.component';
import { TranslateModule } from '@ngx-translate/core';




@NgModule({
  declarations: [
    BannerComponent,
    ProductComponent,
    VendorshopsComponent,
    SlidingTabsComponent,
    ScrollingFeaturedProductsComponent,
    CategoriesComponent,
    TimerComponent ,
    RatingComponent
  ],
  exports: [
    BannerComponent,
    ProductComponent,
    VendorshopsComponent,
    SlidingTabsComponent,
    ScrollingFeaturedProductsComponent,
    CategoriesComponent,
    TimerComponent,
    RatingComponent,
    TranslateModule
  ],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    PipesModule,
  ],
})
export class ShareModule { }
