import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../../services/api-service.service';
import { Appointment } from '../../models/Iappointment';
import { Config } from './../../../../node_modules/datatables.net/types/types.d';
import { Router } from '@angular/router';
import { IUser } from '../../models/iuser';
import { firstValueFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import { environment } from '../../../environments/environment.development';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { setAppointment } from '../../store/appointment/app.action';
@Component({
  selector: 'app-appointments',
  imports: [CommonModule],
templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css'
})
export class AppointmentsComponent implements OnInit {
Appointments : Appointment[] = []
Appointment : Appointment = {} as Appointment
 dtOptions: Config = {};
 user : IUser = {} as IUser
empty : boolean = false
 

constructor(private api_service:ApiServiceService,
  private _router: Router,
  private _store : Store<any>
)
{
 
  this._store.select("userId").subscribe({
    next:(user)=>{this.user=user;
  
      if(this.user.email=="admin@clinic.com")
      {
        this.loadAdminView();
      }else
      {
        this.loadPatientView(`${this.user.patientId}`);
      }
      
    },
    error:(err)=>{console.log(err);}
  });
  

}


loadPatientView(patientId:string): void {
   this.api_service.getAppointmentByPatientId(patientId).subscribe({
      next:(apps)=>{this.Appointments=apps ; if(apps.length==0){this.empty=true}else{this.empty=false}},
      error:(err)=>console.log(err)
    });
}
loadAdminView(): void {
   this.api_service.getAppointments().subscribe({
      next:(apps)=>this.Appointments=apps,
      error:(err)=>console.log(err)
    });
}


  ngOnInit(): void {
    
  
  }
  ngAfterViewInit(): void {
    
   // this.loadData("");
    
  }
 navigate()
  {
    this._router.navigate(['/addappointment']);
  }
  cancel(id : string)
  {
    console.log(id);
    Swal.fire
      ({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Cancel it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.api_service.getAppointmentById(id)
          .subscribe({
            next:(app)=>{this.Appointment = app
                  this.Appointment = {...this.Appointment,status:"Canceled"}
                  this.api_service.updateAppointment(this.Appointment).subscribe({
                       next: () => {
        
              console.log('Appointment Canceled successfully');
              this._router.navigateByUrl("/appointments") // Redirect to appointments page after deletion
              // Optionally, refresh the data table or perform other actions
            },
        error: (err) => {
          console.error('Error deleting appointment:', err);
        }
             } 
          )},
            error:(err)=>console.log(err)
      });
          Swal.fire(
            'Canceld!',
            'Your appointment has been Canceled.',
            'success'
          );
        }
      });
  }
  pay(id:string)
  {
      this.api_service.getAppointmentById(id).subscribe({
        next:(app)=>{this._store.dispatch(setAppointment({appointment:app}))}
      })
      this._router.navigateByUrl(`/pay/${id}`)
  }
 


}
