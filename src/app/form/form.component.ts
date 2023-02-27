import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent {
  @Input() breeds = [] as string[];
  @Input()
  set breed(breed: string) {
    this.formGroup.patchValue({ breed }, { emitEvent: false });
  }
  @Input()
  set count(count: number) {
    this.formGroup.patchValue({ count }, { emitEvent: false });
  }

  @Output() formChange = new EventEmitter<DogsForm>();

  formGroup = new FormGroup<ControlsOf<Nullable<DogsForm>>>({
    breed: new FormControl('husky'),
    count: new FormControl(3)
  });

  onFormChange() {
    this.formChange.emit(this.formGroup.value as DogsForm);
  }
}

export type DogsForm = {
  breed: string;
  count: number;
}

type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

type ControlsOf<T extends Record<string, any>> = {
  [K in keyof T]: T[K] extends Record<any, any>
  ? FormGroup<ControlsOf<T[K]>>
  : FormControl<T[K]>;
};