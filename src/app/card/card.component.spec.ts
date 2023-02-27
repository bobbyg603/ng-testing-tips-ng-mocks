import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MockedComponentFixture, MockModule, MockRender } from 'ng-mocks';
import { CardComponent } from './card.component';

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: MockedComponentFixture<CardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MockModule(MatCardModule)],
      declarations: [CardComponent]
    })
    .compileComponents();

    fixture = MockRender(CardComponent);
    component = fixture.point.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set image src property to imgSrc input', () => {
    const imgSrc = 'https://images.dog.ceo/breeds/affenpinscher/n02110627_10047.jpg';
    component.imgSrc = imgSrc;

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('img').src).toBe(imgSrc);
  });
});
