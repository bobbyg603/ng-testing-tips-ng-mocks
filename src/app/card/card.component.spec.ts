import { TestBed } from '@angular/core/testing';
import { MatCard, MatCardImage, MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { createSpyFromClass, Spy } from 'jasmine-auto-spies';
import { MockedComponentFixture, MockModule, MockRender } from 'ng-mocks';
import { DialogComponent } from '../dialog/dialog.component';
import { CardComponent } from './card.component';

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: MockedComponentFixture<CardComponent>;

  const imgSrc = 'https://images.dog.ceo/breeds/affenpinscher/n02110627_10047.jpg';
  let dialog: Spy<MatDialog>;

  beforeEach(async () => {
    dialog = createSpyFromClass(MatDialog);

    await TestBed.configureTestingModule({
      imports: [MockModule(MatCardModule)],
      declarations: [CardComponent],
      providers: [
        { provide: MatDialog, useValue: dialog }
      ]
    })
    .compileComponents();

    fixture = MockRender(CardComponent);
    component = fixture.point.componentInstance;
    component.imgSrc = imgSrc;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set image src property to imgSrc input', () => {
    expect(fixture.debugElement.query(By.directive(MatCardImage)).nativeElement.src).toBe(imgSrc);
  });

  describe('click', () => {
    it('should open dialog', () => {
      fixture.debugElement.query(By.directive(MatCard)).triggerEventHandler('click');

      expect(dialog.open).toHaveBeenCalledWith(
        DialogComponent,
        jasmine.objectContaining({ data: { imgSrc } })
      );
    });
  })
});
