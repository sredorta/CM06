import { Component, OnInit, Input } from '@angular/core';
import { User } from '../_models/user';

@Component({
  selector: 'app-order-personal-data',
  templateUrl: './order-personal-data.component.html',
  styleUrls: ['./order-personal-data.component.scss']
})
export class OrderPersonalDataComponent implements OnInit {
  @Input() user : User;
  constructor() { }

  ngOnInit() {
    console.log(this.user);
  }

}
