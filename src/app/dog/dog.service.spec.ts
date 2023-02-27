import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { createSpyFromClass, Spy } from 'jasmine-auto-spies';
import { MockProvider } from 'ng-mocks';
import { firstValueFrom, of } from 'rxjs';
import { DogService } from './dog.service';

describe('DogService', () => {
  let service: DogService;
  let httpClient: Spy<HttpClient>;

  beforeEach(() => {
    httpClient = createSpyFromClass(HttpClient);
    TestBed.configureTestingModule({
      providers: [
        MockProvider(HttpClient, httpClient)
      ]
    });
    service = TestBed.inject(DogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getBreeds', () => {
    it('should return array of dog breeds', async () => {
      const message = {
        affenpinscher: [],
        african: [],
        airedale: []
      };
      httpClient.get.and.returnValue(of({ message }));

      const result = await firstValueFrom(service.getBreeds());

      expect(result).toEqual(Object.keys(message));
    });
  });

  describe('getDogs', () => {
    it('should return array of dog images', async () => {
      const count = 3;
      const breed = 'affenpinscher';
      const message = [`https://images.dog.ceo/breeds/affenpinscher/n02110627_10047.jpg`];
      httpClient.get.and.returnValue(of({ message }));

      const result = await firstValueFrom(service.getDogs(breed, count));

      expect(result).toEqual(message);
      expect(httpClient.get).toHaveBeenCalledWith(`https://dog.ceo/api/breed/${breed}/images/random/${count}`);
    });
  });
});
