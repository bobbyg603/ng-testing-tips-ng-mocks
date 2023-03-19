import { MatProgressSpinner, MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { createSpyFromClass, Spy } from 'jasmine-auto-spies';
import { MockBuilder, MockedComponentFixture, MockRender, ngMocks } from 'ng-mocks';
import { firstValueFrom, of, skip } from 'rxjs';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';
import { CardComponent } from './card/card.component';
import { DialogComponent } from './dialog/dialog.component';
import { DogService } from './dog/dog.service';
import { FormComponent } from './form/form.component';

let dogService: Spy<DogService>;
let app: AppComponent;
let breeds: string[];
let dogs: string[];

let rendered: MockedComponentFixture<AppComponent>;
let cardComponents: CardComponent[];
let formComponent: FormComponent;

describe('AppComponent', () => {
  beforeEach(async () => {
    breeds = ['affenpinscher', 'african', 'airedale'];
    dogs = ['https://images.dog.ceo/breeds/affenpinscher/n02110627_10047.jpg'];
    dogService = createSpyFromClass(DogService);
    dogService.getBreeds.and.returnValue(of(breeds));
    dogService.getDogs.and.returnValue(of(dogs));
    await MockBuilder(AppComponent, AppModule)
      .mock(FontAwesomeModule)
      .mock(MatProgressSpinnerModule)
      .mock(MatToolbarModule)
      .mock(CardComponent)
      .mock(DialogComponent)
      .mock(FormComponent)
      .provide({ provide: DogService, useValue: dogService });
    rendered = MockRender(AppComponent, null, { detectChanges: false });
    app = rendered.point.componentInstance;
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

      rendered.detectChanges();
      const result = await resultPromise;

      expect(result).toBe(false);
    });
  });

  describe('onFormChange', () => {
    it('should call getDogs with breed and count', () => {
      const breed = 'affenpinscher';
      const count = 3;

      app.onFormChange({ breed, count });

      expect(dogService.getDogs).toHaveBeenCalledWith(breed, count);
    });
  });

  describe('template', () => {
    beforeEach(() => {
      rendered.detectChanges();
      cardComponents = ngMocks.findAll(CardComponent).map(c => c.componentInstance);
      formComponent = ngMocks.find<FormComponent>('app-form').componentInstance;
    });

    it('should render title', () => {
      expect(rendered.nativeElement.querySelector('span.title')?.textContent).toMatch(app.title);
    });

    it('should pass breed to form', () => {
      expect(formComponent.breed).toBe(app.breed);
    });

    it('should pass breeds to form', () => {
      expect(formComponent.breeds).toBe(breeds);
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

    it('should not show spinner when not loading', () => {
      rendered.componentInstance.loading$ = of(false);
      rendered.detectChanges();
      expect(ngMocks.findAll(MatProgressSpinner).length).toBe(0);
    });

    it('should call onFormChange when form component raises formChange event', () => {
      const event = { breed: 'affenpinscher', count: 3 };
      const spy = spyOn(rendered.componentInstance, 'onFormChange');

      formComponent.formChange.emit(event);

      expect(spy).toHaveBeenCalledWith(event);
    });
  });
});
