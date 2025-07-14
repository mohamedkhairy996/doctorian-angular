import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../../services/api-service.service';
import { Doctor } from '../../models/Idoctor';
import { firstValueFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import { IUser } from '../../models/iuser';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  doctors : Doctor[] = [] as Doctor[]
  user : IUser = {} as IUser
constructor(private _apiService : ApiServiceService , private Store: Store<any> , private _router : Router)
{
  
}


  async ngOnInit(): Promise<void> {
   this.doctors = await firstValueFrom(this._apiService.getDoctors());
   this.user = await firstValueFrom(this.Store.select("userId"));
  }


  addAppointment(docId:string)
  {
    this._router.navigate(['/addappointment', this.user.patientId, docId]);
  }

}
