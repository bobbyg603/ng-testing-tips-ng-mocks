import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

interface DialogData {
  imgSrc: string;
}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {
  imgSrc = '';
  
  constructor(@Inject(MAT_DIALOG_DATA) data: DialogData) {
    this.imgSrc = data.imgSrc;
  }
}
