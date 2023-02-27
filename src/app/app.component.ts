import { Component } from '@angular/core';
import { faAngular, faGithub, faMedium, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';
import { DogService } from './dog/dog.service';
import { DogsForm } from './form/form.component';
import { nextTurn } from './utils/next-turn';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  readonly title = 'ng-testing-tips';

  readonly faAngular = faAngular;
  readonly faGithub = faGithub;
  readonly faMedium = faMedium;
  readonly faTwitter = faTwitter;
  
  breeds$: Observable<string[]>;
  dogs$: Observable<string[]>;
  loading$: Observable<boolean>;

  breed: string;
  count: number;
  
  private loadingSubject: Subject<boolean>;
 
  constructor(private dogService: DogService) {
    this.breed = 'husky';
    this.count = 3;
    this.loadingSubject = new BehaviorSubject(true);
    this.breeds$ = this.getBreeds();
    this.dogs$ = this.getDogs();
    this.loading$ = this.loadingSubject.asObservable().pipe(nextTurn());
  }

  onFormChange(form: DogsForm) {
    const { breed, count } = form;
    this.breed = breed;
    this.count = count;
    this.dogs$ = this.getDogs();
  }

  private getBreeds() {
    return this.dogService.getBreeds();
  }
  
  private getDogs() {
    this.loadingSubject.next(true);
 
    return this.dogService.getDogs(this.breed, this.count)
      .pipe(
        tap(() => this.loadingSubject.next(false))
      );
  }
}
