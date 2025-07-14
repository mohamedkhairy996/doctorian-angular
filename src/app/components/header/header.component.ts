import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from "../home/home.component";
import { AboutUsComponent } from "../about-us/about-us.component";
import { AppointmentsComponent } from "../appointments/appointments.component";
import { Router, RouterModule } from '@angular/router';
import { ApiServiceService } from '../../services/api-service.service';
import { firstValueFrom, Observable } from 'rxjs';
import { props, Store } from '@ngrx/store';
import { IUser } from '../../models/iuser';
import { AsyncPipe, CommonModule } from '@angular/common';
import swal from 'sweetalert2';
@Component({
  selector: 'app-header',
	imports: [NgbNavModule,RouterModule,CommonModule],
 templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  user! : IUser
  userId$ !: Observable<string> ; 

  constructor(private _apiService:ApiServiceService
    , private _store:Store<any> ,
    private _router:Router ,
    private cdr: ChangeDetectorRef) 
  {
    this.userId$ = this._store.select("userId");
  }
ngOnInit(): void {
 this._store.select("userId").subscribe
  ((userId) => {
    this.user = userId;
    this.cdr.detectChanges(); // Trigger change detection to update the view})
  });
 }

 logout()
 {
  this._apiService.SignOut().subscribe({
    next: () => {swal.fire({
                        title: 'Success',
                        text: 'User signed Out successfully!',
                        icon: 'success',
                        showConfirmButton:false
                      });
              // Handle successful login logic here
              this._router.navigateByUrl('/login').then(() => {
              const my = setInterval(() => {
                location.reload();
                clearInterval(my); // ✅ دي الصح
              }, 500);
            });
    
            },
            error: (error) => {
              console.error('LogOut failed:', error);
              swal.fire({
                        title: 'Error',
                        text: 'There was an error Sign Out the user. Please try again.'+ error.message,
                        icon: 'error',
                        confirmButtonText: 'OK'
                      });
              // Handle login failure logic here
            }
          });
 }
}

