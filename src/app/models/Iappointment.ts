import { Doctor } from "./Idoctor";
import { Patient } from './Ipatient';

export interface Appointment {
    id : string,
    startTime : Date,
    day:Date,
    durationMinutes:number,
    status:string,
    diagnosis:string,
    patientId:string,
    doctorId:string,
    doctor:Doctor,
    patient:Patient
}
