import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { IApiBrand, IApiModel } from '../../_library/services/api.service';
import {SearchBrandComponent} from '../../_library/search-brand/search-brand.component';

@Component({
  selector: 'app-product-create-update',
  templateUrl: './product-create-update.component.html',
  styleUrls: ['./product-create-update.component.scss']
})
export class ProductCreateUpdateComponent implements OnInit {
  @Input() brand : IApiBrand;
  @Input() model : IApiModel;

  constructor() { }

  ngOnInit() {
  }


}
