import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  lat: number = 43.613946;
  lng: number = 6.959412;
  zoom:number = 14;
  constructor() { }

  ngOnInit() {
  }

}
