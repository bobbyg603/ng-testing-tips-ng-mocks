import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogComponent } from './dialog.component';

describe('DialogComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;

  const imgSrc = 'https://images.dog.ceo/breeds/affenpinscher/n02110627_10047.jpg';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { imgSrc } }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set image src property to value of imgSrc', () => {
    expect(fixture.nativeElement.querySelector('img').src).toBe(imgSrc);
  });
});
