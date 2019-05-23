import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { opdlabtest } from './opd-labtest-model';
import { SelectItem,MessageService } from 'primeng/api';
import { LabtestServiceService } from '../add-lab-test/labtest-service.service';
import { OpdLabTestService } from '../Services/opd-lab-test.service';
import { PatientserviceService } from '../patientservice.service';

@Component({
  selector: 'app-opd-labtest',
  templateUrl: './opd-labtest.component.html',
  styleUrls: ['./opd-labtest.component.css']
})
export class OpdLabtestComponent implements OnInit {

  addLabTests:opdlabtest=new opdlabtest();
  showLoading= true;
  hidder = false;
  show = false;
  showspinloading=true;
  showspinLoadingMessage = "Loading";
  multiDropdown: SelectItem[];
  printLabTest = [];
  name: string[];
  printer= true;
  labtestArray=[];
  patientName: String;
  patientMrNo: Number;
  
  
  date;
  constructor(private router: Router,private patientService: PatientserviceService,private activeRoute:ActivatedRoute,private labtest:LabtestServiceService,private messageservice:MessageService,private labtestservice:OpdLabTestService) { }

  ngOnInit() {
    this.getfacilitiesInDropdown();
    // if(this.multiDropdown == []){
    //   this.show = true;
    //   this.showLoading = true;
    // }
  //this.showLoading=true
  let id =this.activeRoute.snapshot.params['id'];
    this.addLabTests.id= parseInt(id);
    
    this.addLabTests.price = 0;
    this.patientService.getPatientsByMRNO(id).subscribe((a) => {
      console.log(a)
      this.patientName = a.name;
      this.patientMrNo = a.id;
    })
  


  }
  back() {
    this.router.navigate(['/monitor/'+ this.addLabTests.id]);
  }

  showLoadingSpinnerAndHideForm(msg){
    this.showspinloading=true;
    this.show=false
    this.showspinLoadingMessage = msg;
  }

  hideLoadingSpinnerAndShowForm(){
    this.show=true
    this.showspinloading=false;
  }

  onChangeLabTest(){
    console.log("yeh id hai"+this.addLabTests.id)
    // for(var i in this.addEmergency.facilities)
    //   this.name = (this.addEmergency.facilities[i]["facilities"]);
    //   console.log(this.name);
    this.printLabTest = []
    this.labtestArray=[]
   
    this.addLabTests.labTests.map((f)=>{
       this.printLabTest.push(f["name"])

       let obj = {
        name: f["name"],
        price: f["price"]
      }
      this.labtestArray.push(obj);
      

     })
     this.date = new Date();
     this.printLabTest.join(',')
    ///let printfacilities = this.addEmergency.facilities.join(',')
    console.log(this.printLabTest)
  
    this.addLabTests.price = 0;
    this.addLabTests.total = 0;
    this.addLabTests.discount=this.addLabTests.discount/100;
    
    this.addLabTests.labTests.map(f => {
    this.addLabTests.price = this.addLabTests.price + parseInt(f["price"]);
    
    // this.addLabTests.cashRecieve-(this.addLabTests.discount*this.addLabTests.cashRecieve);
    console.log(this.addLabTests.total);
    
    });

  }

  onChangeDiscount(){
  console.log("hello discount")
 let discount = this.addLabTests.discount;
 this.addLabTests.total = this.addLabTests.price - discount;
}

  getfacilitiesInDropdown() {
   
    this.multiDropdown = [];
   
   // this.showLoading = true;
   this.showLoadingSpinnerAndHideForm("Getting labtests");
    this.labtest.getlabtest().subscribe(
      data => {
             
        if(data.length){
          this.hidder = false;
          this.hideLoadingSpinnerAndShowForm()
        
        }
        else {
          this.showspinloading = false;
          this.hidder = true;
        }
          
              // for (var keys in data){
          //   this.name.push((data[keys].facilities));
          //   // this.name.push((data[keys].price));
          //   console.log("men names honn"+name);
          // }
          // // console.log(data[0]);
          console.log("hello")
        data.map(e => {
         
        
          this.multiDropdown.push({
            label: e.name,
            value: e
          });
        });
      
       
      },
      error => {
        this.show = false;
        console.log(error)
        this.showspinloading = false;

        console.log("error agya yar");
        this.messageservice.add({
          severity: "error",
          summary: "Error Found",
          detail: "Something went wrong check your internet connection "
        });
      
      }
    );
  }
  saveOpdLabTest(){
    console.log(this.addLabTests)
    console.log(this.addLabTests.labTests);
    this.addLabTests.labTests = this.printLabTest;
    console.log(this.addLabTests)
    this.labtestservice.saveOpdEr(this.addLabTests).subscribe(

      data => {
        // here is printer thing
       // this.printId = "print-section";
       //this.showprint = false;
       this.printer = false;
        console.log(data);
        this.messageservice.add({
          severity: "success",
          summary: "Added Succesfully",
          detail: "Emergency Service Added"
          
        });
      },
      error => {
        this.printer = true;
        console.log(error);
        this.messageservice.add({
          severity: "error",
          summary: "Error Found",
          detail: "Something went wrong check your internet connection "
        });
      }

    )
  }


  routeToAddLab()
  {
    this.router.navigate(['addlab']);
  }



}
