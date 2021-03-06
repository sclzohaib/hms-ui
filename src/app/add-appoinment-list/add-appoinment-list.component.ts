import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppointmentServiceService } from '../Services/appointment-service.service';
import { MessageService } from 'primeng/api';
import { Status } from './SelectStatus';
import { _dateClass } from './dateModel';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-appoinment-list',
  templateUrl: './add-appoinment-list.component.html',
  styleUrls: ['./add-appoinment-list.component.css']
})
export class AddAppoinmentListComponent implements OnInit {
  varr: any;
  cols: any[];
  showLoading: any;
  _existingPatient: any;
  SelectStatus: any;
  date1: Date;
  datefilter: Date;
  showInactive:boolean = true;
  _status: Status = new Status();
  date: _dateClass = new _dateClass();
  show : boolean  = true;
  constructor(
    private router: Router,
    private appointmentService: AppointmentServiceService,
    private messageService: MessageService
  ) {
    this.SelectStatus = [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
      { label: 'Done', value: 'done' }
    ];
  }

  ngOnInit() {
    this.showTable();
  }

  showStatus() {
    this.showLoading = true;
    this.show = true;
    this.showInactive = true;
    this.appointmentService.getStatus(this._status.status).subscribe(Response => {
       if(this._status.status==="done" ){
         this.show = false;
       }else if(this._status.status == "inactive"){
        this.show = false;
        this.showInactive = false;
       }

      this.showLoading = false;
      for (const i in Response) {
          this._existingPatient.push({
          id: Response[i].id,
          selectDoctor: Response[i].selectDoctor,
          patientName: Response[i].patientName,
          phoneNo: Response[i].phoneNo,
          appoinmentDate: new Date(Response[i].appoinmentDate).toDateString(),
          time: Response[i].time
        });
      }
    });

    this.cols = [
      { field: 'id', header: 'MR Number' },
      { field: 'selectDoctor', header: 'Doctor Name' },
      { field: 'patientName', header: 'Patient Name' },
      { field: 'phoneNo', header: 'patient Number' },
      { field: 'appoinmentDate', header: 'Appointment Date' },
      { field: 'time', header: 'Time' }
    ];

    this._existingPatient = [];
  }

  showDate(d) {
    this.showLoading = true;
    this.appointmentService.getDate(d).subscribe(Response => {
      this.showLoading = false;
      for (const i in Response) {
        this._existingPatient.push({
          id: Response[i].id,
          selectDoctor: Response[i].selectDoctor,
          patientName: Response[i].patientName,
          phoneNo: Response[i].phoneNo,
          appoinmentDate: new Date(Response[i].appoinmentDate).toDateString(),
          time: Response[i].time
        });
      }
    });

    this.cols = [
      { field: 'id', header: 'MR Number' },
      { field: 'selectDoctor', header: 'Doctor Name' },
      { field: 'patientName', header: 'Patient Name' },
      { field: 'phoneNo', header: 'Phone No.' },
      { field: 'appoinmentDate', header: 'Appointment Date' },
      { field: 'time', header: 'Time' }
    ];

    this._existingPatient = [];
  }

  showTable() {
    this.showLoading = true;
    this.appointmentService.getAppointment().subscribe(Response => {
      this.showLoading = false;
      for (const i in Response) {
        this._existingPatient.push({
          id: Response[i].id,
          selectDoctor: Response[i].selectDoctor,
          patientName: Response[i].patientName,
          phoneNo: Response[i].phoneNo,
          appoinmentDate: new Date(Response[i].appoinmentDate).toDateString(),
          time: Response[i].time
        });
      }
    });

    this.cols = [
      { field: 'id', header: 'MR Number' },
      { field: 'selectDoctor', header: 'Doctor Name' },
      { field: 'patientName', header: 'Patient Name' },
      { field: 'phoneNo', header: 'Phone Number' },
      { field: 'appoinmentDate', header: 'Appointment Date' },
      { field: 'time', header: 'Time' }
    ];

    this._existingPatient = [];
  }
  backToMain() {
    this.router.navigate(['/mainscreen']);
  }
  existingPatient() {
    this.router.navigate(['/existingPatient']);
  }
  newPatient() {
    this.router.navigate(['/patientform']);
  }

  deleteAppointmentByID(rowData: any) {
    this.messageService.add({
      severity: 'error',
      summary: 'Status',
      detail: 'Successfully Deleted'
    });
    this.appointmentService.deleteById(rowData).subscribe(
      data => {
        this.appointmentService.getAppointment().subscribe((data: any) => {});

        this.showTable();
      },
      error => {
      }
    );
  }
  doneAppointmentByID(rowData: any) {
    this.messageService.add({
      severity: 'successfull',
      summary: 'Status',
      detail: 'Appointment Done'
    });
    this.appointmentService.doneById(rowData).subscribe(
      data => {
        this.appointmentService.getAppointment().subscribe((data: any) => {});

        this.showTable();
      },
      error => {
      }
    );
  }

  saveStatus() {
    this._existingPatient = [];
    this.appointmentService.saveStatus(this._status.status).subscribe(
      data => {
      },
      error => {
      }
    );
    this.showStatus();
  }

  statusOnClick() {
    this.showStatus();
  }
  dateOnClick() {
    // console.log(this.datefilter);
    const d: string =
      this.datefilter.getFullYear() +
      '-' +
      (this.datefilter.getMonth() + 1) +
      '-' +
      this.datefilter.getDate();
    // console.log(d);

    this.showDate(d);
  }
}
