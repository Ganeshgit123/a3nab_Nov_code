import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,Validators,FormArray } from '@angular/forms';
import { ApiCallService } from '../../services/api-call.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { DatePipe } from '@angular/common';
declare var $:any;


@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.css'],
  providers: [DatePipe]
})
export class RulesComponent implements OnInit {
  datePickerConfig:Partial<BsDatepickerConfig>;
  getrules: any;
  statustog = true;
  status: any = true;
  data : any = {};
  addRules: FormGroup;
  bsValue: Date = new Date();
  bsValue1: Date = new Date();
  selectedType:any;
  options:any;
  isEdit = false;
  ruleId: number;

  constructor( private formBuilder:FormBuilder,
    private apiCall: ApiCallService,
    private datePipe: DatePipe) { }

  ngOnInit(): void {

    const data = {status: "active"}
    this.getruleslist(data)

    this.addRules   = this.formBuilder.group({
      title: ['',  [ Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      triggerName: ['',  [ Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      startDate: [this.bsValue,  [ Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      endDate: [this.bsValue1 ,  [ Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      // type: [''],
      // walletAmount: [''],
      // points: [''],
      // notifyTitle: [''],
      // notifyMessage: [''],
      // options: [''],
      options: this.formBuilder.array([
        this.getactionStyle()
      ]),
  });

  this.options = this.addRules.controls.options.value

  }

  private getactionStyle() {
    return this.formBuilder.group({
      type: [''],
      walletAmount: [''],
      points: [''],
      notifyTitle: [''],
      notifyMessage: ['']
    })
  }

  

  addaction(){
    let control = <FormArray>this.addRules.controls.options;
    control.push(
      this.formBuilder.group({
        type: [''],
        walletAmount: [''],
        points: [''],
        notifyTitle: [''],
        notifyMessage: ['']
      })
    )
  }

  onChange(event) {
    this.selectedType = event.target.value;
  }

  getruleslist(data){

    var params = {
      url: 'admin/rulesList',
      data: data
    }

    this.apiCall.commonPostService(params).subscribe((result:any)=>{
      let res = result.body;
      if(res.error=="false")
      {    
           this.getrules = res.data.rules;
          //  console.log("get",this.getrules)
      }else{
        this.apiCall.showToast(res.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
    });
  }


onchange(values:any){

  let stat = values.currentTarget.checked ? "active" : "inactive"; 
  console.log("????",stat)
  const data = {status: stat}
  this.getruleslist(data);

}

statchange(status,id){

  const object = {}
  object['id'] = id
  if(status){
    object['status'] = 'active'
  } else {
    object['status'] = 'inactive'
  }
  // console.log("st",object)

  let params ={
    url:"admin/ruleStatus",
    data : object
  }


  this.apiCall.commonPostService(params).subscribe((result:any)=>{
    let resu = result.body;
    if(resu.error == "false")
    {
      this.apiCall.showToast("Status updated Successfully", 'Success', 'successToastr');
      this.ngOnInit();
    }else{
      this.apiCall.showToast(resu.message, 'Error', 'errorToastr');
    }
    
  },(error)=>{
    console.error(error);
  });

}

addNewRule(){
  this.isEdit = false; 
  this.addRules.reset();
}

public viewRules(data){

  this.isEdit = true

  // console.log("ed",data)
  $('#add_rule_btn').modal('show');

  this.ruleId = data['id']

  var options = data['options']

  var optionsArray = []

  
  if(options.length > 0){
    for(var i=0; i < options.length; i++){
      optionsArray.push(this.buildFormOptionArray(options[i]))
    }
  }

  this.addRules   = this.formBuilder.group({
  
    title: [data['title'],  [ Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      triggerName: [data['triggerName'],  [ Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      startDate: [data['startDate'],  [ Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      endDate: [data['endDate'] ,  [ Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      options: this.formBuilder.array(optionsArray),
  })
  }
  
  buildFormOptionArray(obj): FormGroup{
    return this.formBuilder.group({
      walletAmount: [obj.walletAmount,  [Validators.pattern(/^(?!\s*$).+/)]],
      points: [obj.points,  [Validators.pattern(/^(?!\s*$).+/)]],
      type: [obj.type,  [Validators.pattern(/^(?!\s*$).+/)]],
      notifyTitle: [obj.notifyTitle,  [Validators.pattern(/^(?!\s*$).+/)]],
      notifyMessage: [obj.notifyMessage,  [Validators.pattern(/^(?!\s*$).+/)]],
    })
}

async onSubmit(){
  if(!this.addRules.valid){
    this.apiCall.showToast('Please Fill the mandatory field', 'Error', 'errorToastr')
    return false;
  }

  const formData = new FormData();

  let opt:any ={};

  const postData = this.addRules.value

  opt.title = postData.title;
  opt.triggerName = postData.triggerName;
  opt.startDate = this.datePipe.transform(postData.startDate, 'yyyy-MM-dd');
  opt.endDate = this.datePipe.transform(postData.endDate, 'yyyy-MM-dd');
  opt.options = JSON.stringify(postData.options);

  var params = {
    url: 'admin/addNewRule',
    data: opt
  }
//  console.log("data",params)
  this.apiCall.commonPostService(params).subscribe(
    (response: any) => {
      if (response.body.error == 'false') {
        // Success
        this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
        $('#add_rule_btn').modal('hide');
        this.ngOnInit();
        // this.router.navigateByUrl('/dashboard');
      } else {
        // Query Error
        this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
      }
    },
    (error) => {
      this.apiCall.showToast('Server Error !!', 'Oops', 'errorToastr')
      console.log('Error', error)
    }
  )

}

del_rules(id)
{
  this.data.id = id
  this.data.isDelete =1
  
  var params = {
    url: 'admin/deleteRules',
    data: this.data
    
  }

  this.apiCall.commonPostService(params).subscribe((result:any)=>{
    if(result.body.error=="false")
    {
   
      this.apiCall.showToast(result.body.message, 'Success', 'successToastr')
      this.ngOnInit();
     }
     else{
      this.apiCall.showToast(result.body.message, 'Error', '')
     }
 });
}

}
