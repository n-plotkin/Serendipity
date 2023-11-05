import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/internal/operators/map';
import { User } from '../_models/user';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
//using a service for this allows us to centralize the functions of our http requests
//this service is autmatically included in the module
//service has a lifetime of the application, 
//as opposed to the component, which is destroyed when we move from component to component

//in other words, a service helps us store state

export class AccountService {
  baseUrl = environment.apiUrl;
  //create behaviorsubject of type user or null union type with default value null
  private currentUserSource = new BehaviorSubject<User | null>(null);
  // $ convention to indicate observable
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient) { }

  login(model: any){
    //you can tell post to give you a specific type
    return this.http.post<User>(this.baseUrl + 'account/login', model).pipe(
      map((reponse: User) => {
        const user = reponse;
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource.next(user);
        }
      })
    )
  }

  register(model: any){
    return this.http.post<User>(this.baseUrl + 'account/register', model).pipe(
      //so what happens here is we take the return from the http post 
      //and process it before even returning it.
      map(user => {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource.next(user);
        }
      })
    )
  }

  setCurrentUser(user: User){
    this.currentUserSource.next(user);
  }

  logout(){
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }
}
