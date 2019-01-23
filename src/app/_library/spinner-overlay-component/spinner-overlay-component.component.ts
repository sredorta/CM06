import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-spinner-overlay-component',
  templateUrl: './spinner-overlay-component.component.html',
  styleUrls: ['./spinner-overlay-component.component.scss']
})
export class SpinnerOverlayComponentComponent implements OnInit {
  @Input() show:boolean = false;
  constructor() { }

  ngOnInit() {
  }

}
