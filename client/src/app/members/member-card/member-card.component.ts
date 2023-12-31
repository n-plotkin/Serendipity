import { ViewEncapsulation } from '@angular/core';
import { Component, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';
import { PresenceService } from 'src/app/_services/presence.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css'],
})
export class MemberCardComponent {
  @Input() member: Member | undefined;

  /**
   *
   */
  constructor(private memberService: MembersService, private toastr: ToastrService, 
    //make public so we can use async pipe in template
    public presenceService: PresenceService) {
    
  }



  addLike(member: Member){
    this.memberService.addLike(member.userName).subscribe({
      next: () => {
        this.toastr.success("You have followed " + member.knownAs)
      } 
    })
  
  }
  
}

