import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatProgressSpinner, MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { createSpyFromClass, Spy } from 'jasmine-auto-spies';
import { MockComponent, MockedComponentFixture, MockModule, MockProvider, MockRender, ngMocks } from 'ng-mocks';
import { firstValueFrom, of, skip } from 'rxjs';
import { AppComponent } from './app.component';
import { CardComponent } from './card/card.component';
import { DogService } from './dog/dog.service';
import { FormComponent } from './form/form.component';

let dogService: Spy<DogService>;
let fixture: ComponentFixture<AppComponent>;
let app: AppComponent;
let breeds: string[];
let dogs: string[];

describe('AppComponent', () => {
  breeds = ['affenpinscher', 'african', 'airedale'];
  dogs = ['https://images.dog.ceo/breeds/affenpinscher/n02110627_10047.jpg'];
  dogService = createSpyFromClass(DogService);
  dogService.getBreeds.and.returnValue(of(breeds));
  dogService.getDogs.and.returnValue(of(dogs));
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MockModule(FontAwesomeModule),
        MockModule(MatProgressSpinnerModule),
        MockModule(MatToolbarModule)
      ],
      declarations: [
        AppComponent,
        MockComponent(FormComponent),
        MockComponent(CardComponent)
      ],
      providers: [
        MockProvider(DogService, dogService)
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it(`should have as title 'ng-testing-tips'`, () => {
    expect(app.title).toEqual('ng-testing-tips');
  });

  describe('breeds$', () => {
    it('should emit result of getBreeds from DogService', () => {
      return expectAsync(firstValueFrom(app.breeds$)).toBeResolvedTo(breeds);
    });
  });

  describe('dogs$', () => {
    it('should emit result of getDogs from DogService', () => {
      return expectAsync(firstValueFrom(app.dogs$)).toBeResolvedTo(dogs);
    });
  });

  describe('loading$', () => {
    it('should start with true', () => {
      return expectAsync(firstValueFrom(app.loading$)).toBeResolvedTo(true);
    });

    it('should emit false after call to getDogs', async () => {
      const resultPromise = firstValueFrom(app.loading$.pipe(skip(1)));

      fixture.detectChanges();
      const result = await resultPromise;

      expect(result).toBe(false);
    });
  });

  describe('onFormChang', () => {
    it('should call getDogs with breed and count', () => {
      const breed = 'affenpinscher';
      const count = 3;

      app.onFormChange({ breed, count });

      expect(dogService.getDogs).toHaveBeenCalledWith(breed, count);
    });
  });

  describe('template', () => {
    let rendered: MockedComponentFixture<AppComponent>;
    let cardComponents: CardComponent[];
    let formComponent: FormComponent;

    beforeEach(() => {
      ngMocks.flushTestBed();
      rendered = MockRender(AppComponent);
      cardComponents = ngMocks.findAll(CardComponent).map(c => c.componentInstance);
      formComponent = ngMocks.find<FormComponent>('app-form').componentInstance;
    });

    it('should render title', () => {
      expect(rendered.nativeElement.querySelector('span')?.textContent).toMatch(app.title);
    });

    it('should pass breed to form', () => {
      expect(formComponent.breed).toBe(app.breed);
    });

    it('should pass count to form', () => {
      expect(formComponent.count).toBe(app.count);
    });

    it('should create card for each dog', () => {
      dogs.forEach(dog => {
        expect(cardComponents.find(c => c.imgSrc === dog)).toBeTruthy();
      });
    });

    it('should show spinner when loading', () => {
      rendered.componentInstance.loading$ = of(true);
      rendered.detectChanges();
      expect(ngMocks.find(MatProgressSpinner)).toBeTruthy();
    });
  });
});
