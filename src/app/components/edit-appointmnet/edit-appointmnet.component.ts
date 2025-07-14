import { AfterContentInit, Component, OnInit } from '@angular/core';
import { Appointment } from '../../models/Iappointment';
import { ApiServiceService } from '../../services/api-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';
import { EditorComponent } from '@tinymce/tinymce-angular';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import swal from 'sweetalert2'; // Import SweetAlert2 for alerts
import { Store } from '@ngrx/store';
import { setAppointment } from '../../store/appointment/app.action';
import { dateNotBeforeToday } from '../../validators/dateValidator';

@Component({
  selector: 'app-edit-appointmnet',
  imports: [EditorComponent , FormsModule , ReactiveFormsModule  ,CommonModule],
templateUrl: './edit-appointmnet.component.html',
  styleUrl: './edit-appointmnet.component.css'
})
export class EditAppointmnetComponent implements OnInit {
  init : EditorComponent['init'] = {
    menubar:false
  }
statuses: string[] = ['Assigned','Approved','Waiting','Completed','Refunded','Canceled'];
editForm : FormGroup = {} as FormGroup;
Appointment : Appointment|undefined = {} as Appointment;
Appointments : Appointment[]| undefined = [] as Appointment[];
appoint$ : Observable<Appointment[]> = new Observable<Appointment[]>();
appId:string="";
userAdmin:boolean = false
isLoading = true; // Optional: for showing a loading spinner

  constructor(
    private api_service: ApiServiceService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _store :Store<any>
  ) {
    // 2. Initialize the form IMMEDIATELY in the constructor with empty values.
    // This ensures the template has a form to bind to from the very beginning.
    this.editForm = new FormGroup({
      Status: new FormControl(''), // You can add validators: new FormControl('', Validators.required)
      Diagonsis: new FormControl(''),
      Day: new FormControl([dateNotBeforeToday])
    });
  

  this.Appointments = [] as Appointment[];
  
  
}
  async ngOnInit(): Promise<void> {
    const appointmentId = this._activatedRoute.snapshot.params['id']; // It's okay to use snapshot here if the component is always destroyed on navigation. For more robust code, use paramMap observable.
    
    this.Appointments = await firstValueFrom(this.api_service.getAppointments());
    this.appId = appointmentId;
    this.Appointment = this.Appointments?.find(app=>app.id == appointmentId);
    if (this.Appointment) {
          this._store.dispatch(setAppointment({appointment:this.Appointment}))
          let user =await firstValueFrom(this._store.select("userId"));
          this.userAdmin = user.email=="admin@clinic.com" ? true : false ;
          let value = this.userAdmin ? this.Appointment.status : "Canceled";
          this.editForm.patchValue({
            Status: value,
            Diagonsis: this.Appointment.diagnosis,
            Day:this.Appointment.day
          });
          
          this.isLoading = false; // Data is loaded, hide spinner
        
    }
  }

get Day()
{
  return this.editForm.get("Day");
}  

  
async onSubmit(): Promise<void> {
  const appointmentId = this.appId;
  const status = this.editForm.value.Status;
  const diagnosis = this.convertToText(this.editForm.value.Diagonsis);
  const day = this.editForm.value.Day;
  console.log(status, diagnosis, appointmentId);
  // Find the appointment by ID
  let Appo = await firstValueFrom(this.api_service.getAppointmentById(appointmentId));
  if (Appo) {
    // Update the appointment's status and diagnosis
    Appo.status = status;
    Appo.diagnosis = diagnosis;
    Appo.day = day;

    console.log('Updated Appointment:', Appo);
    // Call the service to update the appointment
    this.api_service.updateAppointment(Appo).subscribe({
      next: () => {
        console.log('Appointment updated successfully');
        swal.fire({
          icon: 'success',
          title: 'Updated Successfully',
        });
        this._router.navigateByUrl("/appointments")
        // Optionally, refresh the data table or perform other actions
      },
      error: (err) => {
        console.error('Error updating appointment:', err);
        swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Error updating appointment :"+err
        });
      }
    });
  } else {
    console.error('Appointment not found');
  }
}
async onSubmitUser()
{
  const status = this.editForm.value.Status;
  const diagnosis = this.convertToText(this.editForm.value.Diagonsis);
  console.log(status, diagnosis, this.appId);
  // Find the appointment by ID
  let Appo = await firstValueFrom(this.api_service.getAppointmentById(this.appId));
  if (Appo) {
    // Update the appointment's status and diagnosis
    Appo.status = status;
    // Call the service to update the appointment
    this.api_service.updateAppointment(Appo).subscribe({
      next: () => {
        console.log('Appointment updated successfully');
        swal.fire({
          icon: 'success',
          title: 'Updated Successfully',
        });
        this._router.navigateByUrl("/appointments")
        // Optionally, refresh the data table or perform other actions
      },
      error: (err) => {
        console.error('Error updating appointment:', err);
        swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Error updating appointment :"+err
        });
      }
    });
  } else {
    console.error('Appointment not found');
  }
}
pay()
{
  this._router.navigateByUrl("/pay/"+this.appId)
}
cancel()
{
  this._router.navigateByUrl("/appointments")
}

 private convertToText(html: string): string {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
  }

deleteApp(appointmentId: string): void {
  swal.fire
  ({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      this.api_service.deleteAppointment(appointmentId).subscribe({
    next: () => {

      console.log('Appointment deleted successfully');
      this._router.navigateByUrl("/appointments") // Redirect to appointments page after deletion
      // Optionally, refresh the data table or perform other actions
    },
    error: (err) => {
      console.error('Error deleting appointment:', err);
    }
  });
      swal.fire(
        'Deleted!',
        'Your appointment has been deleted.',
        'success'
      );
    }
  });
  
}

}
