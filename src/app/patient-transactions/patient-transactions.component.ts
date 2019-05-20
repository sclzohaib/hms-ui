import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {ActivatedRoute} from '@angular/router';
import { PatientTransactionsService } from '../Services/patient-transactions.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-patient-transactions',
  templateUrl: './patient-transactions.component.html',
  styleUrls: ['./patient-transactions.component.css']
})
export class PatientTransactionsComponent implements OnInit {
  transaction: any[];
  totalRecords = 0;
  datasource: any = [];
  cols: any[];

  constructor(
    private transactionsService: PatientTransactionsService,
    private route: Router,
    private location: Location,
    private activateRoute: ActivatedRoute
  ) {
    this.cols = [
      { field: 'id', header: 'ID' },
      { field: 'transactionDate', header: 'Transaction Date' },
      { field: 'receivedAmount', header: 'Received Amount' },
      { field: 'totalAmount', header: 'Total Amount' },
      { field: 'transactionType', header: 'Transaction Type' },
      { field: 'description', header: 'Description' },
      { field: 'currency', header: 'Currency' },
      { field: 'operationType', header: 'Operation Type' },
      { field: 'dues', header: 'Dues' }
    ];
  }

  ngOnInit() {
    this.showTable();
  }

  backToMonitor() {
    this.location.back();
  }

  showTable() {
    this.transaction = [];
    //this.loading = true;
    this.totalRecords = 0;
    let id = this.activateRoute.snapshot.params['id'];
    this.transactionsService.getPatientTransactions(id).subscribe(data => {
      console.log('response is here', data);
      this.datasource = [];
      this.datasource = data;
      this.totalRecords = this.datasource.length;
      // data["transactionDate"] = new Date( data["transactionDate"]).toDateString()
      // this.transaction = data;
      let trans = data.map(p => {
        console.log(p);

        this.transaction.push({
          id: p.id,
          transactionDate: new Date(p.transactionDate).toDateString(),
          receivedAmount: p.receivedAmount,
          totalAmount: p.totalAmount,
          transactionType: p.transactionType,
          description: p.description,
          currency: p.currency,
          operationType: p.operationType,
          dues: p.dues
        });
      });
      //this.loading = false;
    });
  }
}
