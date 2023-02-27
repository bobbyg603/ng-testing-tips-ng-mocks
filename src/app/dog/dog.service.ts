import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DogService {

  constructor(private httpClient: HttpClient) { }

  getBreeds() {
    return this.httpClient.get<BreedsResponse>('https://dog.ceo/api/breeds/list/all')
      .pipe(
        map(response => Object.keys(response.message))
      );
  }

  getDogs(breed: string, count: number) {
    return this.httpClient.get<DogsResponse>(`https://dog.ceo/api/breed/${breed}/images/random/${count}`)
      .pipe(
        map(response => response.message)
      );
  }
}

type BreedsResponse = {
  message: Record<string, string[]>;
  status: 'success' | unknown;
}

type DogsResponse = {
  message: string[];
  status: 'success' | unknown;
}