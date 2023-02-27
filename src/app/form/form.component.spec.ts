import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatOptionParentComponent } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MockedComponentFixture, MockModule, MockRender, ngMocks } from 'ng-mocks';
import { firstValueFrom } from 'rxjs';
import { FormComponent } from './form.component';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: MockedComponentFixture<FormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormComponent],
      imports: [
        ReactiveFormsModule,
        MockModule(MatFormFieldModule),
        MockModule(MatInputModule),
        MockModule(MatSelectModule)
      ]
    })
    .compileComponents();

    fixture = MockRender(FormComponent);
    component = fixture.point.componentInstance;

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('breed', () => {
    it('should patch formValue with breed', () => {
      const breed = 'affenpinscher';
      component.breed = breed;
      expect(component.formGroup.value.breed).toBe(breed);
    });
  });

  describe('breeds', () => {
    it('should display breeds in select', () => {
      const breeds = ['affenpinscher', 'african', 'airedale'];
      component.breeds = breeds;

      fixture.detectChanges();
      const options = ngMocks.findAll('mat-option').map(c => c.componentInstance);

      breeds.forEach(breed => {
        expect(options.find(option => option.value === breed)).toBeTruthy();
      });
    });
  });

  describe('count', () => {
    it('should patch formValue with count', () => {
      const count = 5;
      component.count = count;
      expect(component.formGroup.value.count).toBe(count);
    });
  });

  describe('onFormChange', () => {
    it('should emit formValue', async () => {
      const resultPromise = firstValueFrom(component.formChange);
      const breed = 'affenpinscher';
      const count = 5;
      component.formGroup.patchValue({ breed, count });

      component.onFormChange();
      const result = await resultPromise;
      
      expect(result).toEqual(jasmine.objectContaining({ breed, count }));
    });
  });
});
