import { Component } from '@angular/core';
import { Observable, take } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { Pagination } from 'src/app/_models/pagination';
import { User } from 'src/app/_models/user';
import { UserParams } from 'src/app/_models/userParams';
import { userSpotifyData } from 'src/app/_models/userSpotifyData';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';
import { SpotifyService } from 'src/app/_services/spotify.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent {
  //members$: Observable<Member[]> | undefined;
  members: Member[] = [];
  pagination: Pagination | undefined;
  userParams: UserParams | undefined;
  typeList = [{ value: 'song', display: 'Currently Listening' }, { value: 'artist', display: 'Top Artist' }]
  spotifyInfo?: userSpotifyData | null;

  constructor(private memberService: MembersService,
    private spotifyService: SpotifyService) {
      this.userParams = this.memberService.getUserParams();
  }

  ngOnInit() {
    //this.members$ = this.memberService.getMembers();
    this.setupSpotifySubscription();
    this.loadSpotify();
    this.loadMembers();
  }


  setupSpotifySubscription() {
    this.spotifyService.currentSong$.subscribe({
      next: (response) => {
        this.spotifyInfo = response;
        if (this.userParams != null && this.userParams.typeof == "song"){
          this.loadMembers();
        }
      },
      error: (err) => console.error('Error updating Spotify info:', err),
    });
  }

  loadSpotify(){
    this.spotifyService.getCurrentData();
  }

  loadMembers() {
    if (this.userParams) {
      this.memberService.setUserParams(this.userParams);
      this.memberService.getMembers(this.userParams).subscribe({
        next: response => {
          //just being defensive here
          if (response.result && response.pagination) {
            this.members = response.result;
            this.pagination = response.pagination;
          }
        }
      })
  }
  }

  resetFilters() {
    const reset = this.memberService.resetUserParams();
    if (reset){
      this.userParams = reset[0];
      this.pagination = reset[1];
    }
    this.loadMembers();
  }

  pageChanged(event: any) {
    if (this.userParams && this.userParams?.pageNumber !== event.page) {
      this.userParams.pageNumber = event.page;
      this.memberService.setUserParams(this.userParams);
      this.loadMembers();
      this.loadSpotify();
    }
  }
}
