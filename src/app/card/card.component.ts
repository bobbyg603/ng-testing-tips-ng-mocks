import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() imgSrc = '';

  loading = true;

  constructor(private dialog: MatDialog) { }

  onClick() {
    this.dialog.open(DialogComponent, {
      data: {
        imgSrc: this.imgSrc
      }
    });
  }
}
