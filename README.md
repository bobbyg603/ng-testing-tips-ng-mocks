![angular-testing-tips-ng-mocks](https://user-images.githubusercontent.com/2646053/226212437-86be77b1-4700-493a-9a2b-05ec0841f8a6.png)

# Angular Testing Tips: Ng-Mocks

This repo demonstrates how to use the [ng-mocks](https://ng-mocks.sudo.eu/) and [jasmine-auto-spies](https://www.npmjs.com/package/jasmine-auto-spies) to write better Angular unit tests. A companion article for this repo can be found on Medium.

## Steps 🥾

Clone or fork this repo

```bash
git clone https://github.com/bobbyg603/ng-testing-tips-ng-mocks
```

Install the dependencies

```bash
cd ng-testing-tips-ng-mocks && npm i 
```

Run the sample application

```bash
npm run start
```

Run the tests

```bash
npm test
```

## Examples 🧑‍🏫

Using [MockComponent](https://ng-mocks.sudo.eu/api/MockComponent), we can easily declare fake components with all the propert `inputs` and `outputs` and use them in our tests.

[app.component.spec.ts@536ef8d](https://github.com/bobbyg603/ng-testing-tips-ng-mocks/blob/536ef8d19be9be22a3e0b267ec315ea27cd49ba1/src/app/app.component.spec.ts#L32C8-L36)
```ts
declarations: [
  AppComponent,
  MockComponent(FormComponent),
  MockComponent(CardComponent)
],
```

Declaring mocked providers is also easy to do with the help of MockProvider.

[app.component.spec.ts@536ef8d](https://github.com/bobbyg603/ng-testing-tips-ng-mocks/blob/536ef8d19be9be22a3e0b267ec315ea27cd49ba1/src/app/app.component.spec.ts#L37-L39)
```ts
providers: [
  MockProvider(DogService, dogService)
]
```

Ditto for [MockModule](https://ng-mocks.sudo.eu/api/MockProvider).

[app.component.spec.ts@536ef8d](https://github.com/bobbyg603/ng-testing-tips-ng-mocks/blob/536ef8d19be9be22a3e0b267ec315ea27cd49ba1/src/app/app.component.spec.ts#L27-L31)
```ts
imports: [
  MockModule(FontAwesomeModule),
  MockModule(MatProgressSpinnerModule),
  MockModule(MatToolbarModule)
],
```

We can actually forgo all this noise by using [MockBuilder](https://ng-mocks.sudo.eu/api/MockBuilder).

[app.component.ts](https://github.com/bobbyg603/ng-testing-tips-ng-mocks/blob/578b2d7602b3eb17fb749c918033514e7665af3b/src/app/app.component.spec.ts#L30-L37)
```ts
await MockBuilder(AppComponent, AppModule)
  .mock(FontAwesomeModule)
  .mock(MatProgressSpinnerModule)
  .mock(MatToolbarModule)
  .mock(CardComponent)
  .mock(DialogComponent)
  .mock(FormComponent)
  .provide({ provide: DogService, useValue: dogService });
```

[MockRender](https://ng-mocks.sudo.eu/api/MockRender) can be used as a drop in replacement for TestBed, and is super helpful for rendering custom templates and testing directives. For more information on `MockRender` see the companion article.

We can use [find](https://ng-mocks.sudo.eu/api/ngMocks/find), [findAll](https://ng-mocks.sudo.eu/api/ngMocks/findAll), [detectChanges](https://ng-mocks.sudo.eu/api/MockRender#testing-changedetectionstrategyonpush), [componentInstance](https://angular.io/guide/testing-components-basics#componentfixture), [nativeElement](https://angular.io/guide/testing-components-basics#nativeelement), and [querySelector](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector) to help us run expectations against child component [inputs and outputs](https://angular.io/guide/inputs-outputs).

[app.component.ts](https://github.com/bobbyg603/ng-testing-tips-ng-mocks/blob/578b2d7602b3eb17fb749c918033514e7665af3b/src/app/app.component.spec.ts#L88-L137)
```ts
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
```

If you found this repo valuable please subscribe to [@bobbyg603 on Medium](https://medium.com/@bobbyg603) for more Angular tips and tricks. 

Thanks for reading! 
