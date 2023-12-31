import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { BehaviorSubject, take } from 'rxjs';
import { Router } from '@angular/router';
import { SpotifyService } from './spotify.service';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {

  hubUrl = environment.hubUrl;
  private hubConnection?: HubConnection;
  private onlineUsersSource = new BehaviorSubject<string[]>([]);
  onlineUsers$ = this.onlineUsersSource.asObservable();


  constructor(private toastr: ToastrService, private router: Router,
      private spotifyService: SpotifyService) { 
  }



  createHubConnection(user: User) {
    this.hubConnection = new HubConnectionBuilder()
      //hub url is configured on our server side
      .withUrl(this.hubUrl + 'presence', {
        accessTokenFactory: () => user.token
      })
      .withAutomaticReconnect()
      .build();

      this.hubConnection.start().catch(error => console.log(error));

      //the on is to listen for a specific event name on hubConnection
      this.hubConnection.on('UserIsOnline', username => {
        this.onlineUsers$.pipe(take(1)).subscribe({
          next: usernames => this.onlineUsersSource.next([...usernames, username])
        })
      })

      this.hubConnection.on('userIsOffline', username => {
        this.onlineUsers$.pipe(take(1)).subscribe({
          next: usernames => this.onlineUsersSource.next(usernames.filter(x => x !== username))
        })
      })

      this.hubConnection.on('GetOnlineUsers', usernames =>{
        this.onlineUsersSource.next(usernames);
      })

      this.hubConnection.on('NewMessageRecieved', ({username, knownAs}) => {
        this.toastr.info(knownAs + ' has sent you a new message! Click me to see it.')
          .onTap
          .pipe(take(1))
          .subscribe({
            next: () => this.router.navigateByUrl('/members/' + username + '?tab=Messages')
          })
      })
      

  }
  
  stopHubConnection() {
    this.hubConnection?.stop().catch(error => console.log(error));
  }

}
