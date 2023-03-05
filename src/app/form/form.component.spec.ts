import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { By } from '@angular/platform-browser';
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
    const breed = 'affenpinscher';
    const count = 5;

    beforeEach(() => component.formGroup.patchValue({ breed, count }));

    it('should emit formValue when count changes', async () => {
      const resultPromise = firstValueFrom(component.formChange);

      fixture.debugElement.query(By.directive(MatInput)).triggerEventHandler('change');
      const result = await resultPromise;
      
      expect(result).toEqual(jasmine.objectContaining({ breed, count }));
    });

    it('should emit formValue when breed changes', async () => {
      const resultPromise = firstValueFrom(component.formChange);

      fixture.debugElement.query(By.directive(MatSelect)).triggerEventHandler('selectionChange');
      const result = await resultPromise;
      
      expect(result).toEqual(jasmine.objectContaining({ breed, count }));
    });
  });
});
