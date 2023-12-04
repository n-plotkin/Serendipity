import { Component, OnInit } from '@angular/core';
import { AccountService } from './_services/account.service';
import { User } from './_models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Serendipity';

  constructor(private accountService: AccountService){}

  ngOnInit(): void {
    this.setCurrentUser();
  }

  setCurrentUser(){
    //exclamation mark turns off typescript safety
    const userString = localStorage.getItem('user');
    
    if (!userString) return;
    //if we get here there is something inside so no problems with typescript
    const user: User = JSON.parse(userString);
    this.accountService.setCurrentUser(user);
  }

}
