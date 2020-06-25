import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { ConfigService } from 'src/providers/config/config.service';

@Component({
  selector: 'app-categories4',
  templateUrl: './categories4.page.html',
  styleUrls: ['./categories4.page.scss'],
})
export class Categories4Page implements OnInit {

  categories = [];
  parent: { [k: string]: any } = {};
  constructor(
    public shared: SharedDataService,
    public config: ConfigService,
    public router: Router,
    private activatedRoute: ActivatedRoute) {

    this.parent.id = this.activatedRoute.snapshot.paramMap.get('parent');
    this.parent.name = this.activatedRoute.snapshot.paramMap.get('name');

    if (this.parent.name == 0) this.parent.name = "Categories";
  }
  getCategories() {
    let cat = [];
    for (let value of this.shared.allCategories) {
      if (value.parent_id == this.parent.id) { cat.push(value); }
    }
    return cat;
  }
  openVendors(category){
    debugger
    this.shared.categoryName=category.name;
    this.shared.subCategoriesF = [];
        for (let value of this.shared.subCategories) {
          if (value.parent_id == this.shared.categoryId) { this.shared.subCategoriesF.push(value); }
        }
    this.router.navigateByUrl("/home/"+category.id );
  }
  openSubCategories(parent) { 
    let count = 0;
    for (let value of this.shared.allCategories) {
      if (parent.id == value.parent_id) count++;
    }
    if (count != 0)
      this.router.navigateByUrl("/categories4/0/0" + parent.id + "/" + parent.name);
    else
      this.router.navigateByUrl("/products/" + parent.id + "/" + parent.name + "/newest");
  }
  viewAll() {
    this.router.navigateByUrl("/home/All");
  }
  ngOnInit() {
  }
}

