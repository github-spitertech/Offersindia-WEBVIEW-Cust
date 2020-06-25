import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss'],
})
export class RatingComponent implements OnInit {
  @Input('data') vendor;//r
  starArr: Array<string> = [];
  rate=0;
  constructor() { }

  ngOnInit() {}

}
