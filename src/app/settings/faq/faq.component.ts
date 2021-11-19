import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import {ApiCallService} from '../../services/api-call.service';

declare var $:any;

@Component({
selector: 'app-faq',
templateUrl: './faq.component.html',
styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {
addFAQ: FormGroup;
addFAQman: FormGroup;
addCat :FormGroup;
editCat: FormGroup;
// addCatsto: FormGroup;
// editCatsto: FormGroup;
data : any ;
faqlist: any;
faqlistman: any;
categorey_list: any;
id : number;
isEdit  = false;
cat_list_status: any= [];

constructor(
private formBuilder:FormBuilder,
private apiCall: ApiCallService,

) { }

ngOnInit(): void {    
var params = {
url: 'admin/getfaq',
data: {type: "CUSTOMER"} 
}

this.apiCall.commonPostService(params).subscribe((result:any)=>{

if(result.body.error=="false")
{
  this.faqlist = result.body.data.faq
}

});




var params = {
url: 'admin/getfaq',
data: {type: "MANAGER"} 
}

this.apiCall.commonPostService(params).subscribe((result:any)=>{
if(result.body.error=="false")
{
  this.faqlistman = result.body.data.faq
}
});


var catlist = {
url: 'admin/getfaqCategory',
}

this.apiCall.commonGetService(catlist).subscribe((result:any)=>{
if(result.body.error=="false")
{
  this.categorey_list = result.body.data.category;
  for(let ite of this.categorey_list)
  {
  if(ite.status=="true")
  {
    this.cat_list_status.push(ite.categoryName);
  }
  }
}

});

this.addFAQ = this.formBuilder.group({
question:[],
answer: [],
arabicAnswer:[],
arabicQuestion: [],
faqCategory:[]

});

this.addFAQman = this.formBuilder.group({
question:[],
answer: [],
arabicAnswer:[],
arabicQuestion: [],
faqCategory:[]

});

this.addCat = this.formBuilder.group({
categoryName:[],
arabicName: [],

});
this.editCat = this.formBuilder.group({
categoryName:[],
arabicName: [],

});
// this.editCatsto = this.formBuilder.group({
//   categoryName:[],
//   arabicName: [],

// });

// this.addCatsto = this.formBuilder.group({
//   categoryName:[],
//   arabicName: [],

// });



}


add_on_click()
{
this.isEdit =false;
this.addFAQ.reset();


}

on_click_man()
{
this.isEdit =false;
this.addFAQman.reset();

}

onclk_cus(id)
{
this.isEdit = true;
this.id = id
for(let item of this.faqlist)
{
if(item.id == id)
{
this.addFAQ = this.formBuilder.group({
  question:[item.question],
  answer: [item.answer],
  arabicAnswer:[item.arabicAnswer],
  arabicQuestion: [item.arabicQuestion],
  faqCategory:[item.faqCategory]
  
});
}

}
}

onclk_man(id)
{
this.isEdit = true;
this.id = id
for(let items of this.faqlistman)
{
if(items.id == id)
{
this.addFAQman = this.formBuilder.group({
  question:[items.question],
  answer: [items.answer],
  arabicAnswer:[items.arabicAnswer],
  arabicQuestion: [items.arabicQuestion],
  faqCategory:[items.faqCategory]
  
});
}

}
}

onclk_man_del(id)
{

this.data.id = id

var params = {
url: 'admin/deletefaq',
data: this.data

}

this.apiCall.commonPostService(params).subscribe((result:any)=>{
if(result.body.error=="false")
{
this.apiCall.showToast(result.body.message, 'Success', 'successToastr')
this.ngOnInit();
}
else{
this.apiCall.showToast(result.body.message, 'Error', 'errorToastr')
}
});

}

onclk_del(id)
{
this.data.id = id

var params = {
url: 'admin/deletefaq',
data: this.data

}

this.apiCall.commonPostService(params).subscribe((result:any)=>{
if(result.body.error=="false")
{

this.apiCall.showToast(result.body.message, 'Success', 'successToastr')
this.ngOnInit();
}
else{
this.apiCall.showToast(result.body.message, 'Error', 'errorToastr')
}
});

}

add_que_ans_cus()
{
if(!this.addFAQ.valid){
this.apiCall.showToast('Please Fill the mandatory field', 'Error', 'errorToastr')
return false;
}else{

if(this.isEdit==false)
{
var data = this.addFAQ.value;
data['type'] = "CUSTOMER"


var params = {
  url : 'admin/addfaq',
  data : data
}
}else{

var data = this.addFAQ.value;
data['type'] = "CUSTOMER"
data['id']=this.id

var params = {
  url : 'admin/editfaq',
  data : data
}
}

this.apiCall.commonPostService(params).subscribe((result: any)=>{
result = result.body;
if(result.error =="false")
{
  this.apiCall.showToast(result.message, 'Success', 'successToastr');
  $('#add_faq').modal('hide');
  this.ngOnInit();
}else{
  this.apiCall.showToast(result.message, 'Error', 'errorToastr')
}
});
}
}

add_que_ans_man()
{
if(!this.addFAQman.valid){
this.apiCall.showToast('Please Fill the mandatory field', 'Error', 'errorToastr')
return false;
}else{

if(this.isEdit==false)
{
var data = this.addFAQman.value;
data['type'] = "MANAGER"

var params = {
  url : 'admin/addfaq',
  data : data
}

}else{
var data = this.addFAQman.value;
data['type'] = "MANAGER"
data['id'] =this.id

var params = {
  url : 'admin/editfaq',
  data : data
}
}



this.apiCall.commonPostService(params).subscribe((result: any)=>{
result = result.body;
if(result.error =="false")
{
  this.apiCall.showToast(result.message, 'Success', 'successToastr');
  $('#add_faq_stman').modal('hide');
  this.ngOnInit();
}else{
  this.apiCall.showToast(result.message, 'Error', 'errorToastr')
}
});
}
}

add_cat_cus()
{

if(!this.addCat.valid){
this.apiCall.showToast('Please Fill the mandatory field', 'Error', 'errorToastr')
return false;
}else{
var data = this.addCat.value;

var params = {
url : 'admin/addFaqCategory',
data : data
}

this.apiCall.commonPostService(params).subscribe((result: any)=>{
result = result.body;
if(result.error =="false")
{
  this.apiCall.showToast(result.message, 'Success', 'successToastr');
  $('#edit_categ').modal('hide');
  this.ngOnInit();
}else{
  this.apiCall.showToast(result.message, 'Error', 'errorToastr')
}
});
}


}

// add_cat_store()
// {
//   if(!this.addCatsto.valid){
//     this.apiCall.showToast('Please Fill the mandatory field', 'Error', 'errorToastr')
//     return false;
//   }else{
//     var data = this.addCatsto.value;

//     var params = {
//       url : 'admin/addFaqCategory',
//       data : data
//     }

//     this.apiCall.commonPostService(params).subscribe((result: any)=>{
//       result = result.body;
//       if(result.error =="false")
//       {
//         this.apiCall.showToast(result.message, 'Success', 'successToastr');
//         $('#edit_categ').modal('hide');
//         this.ngOnInit();
//       }else{
//         this.apiCall.showToast(result.message, 'Error', '')
//       }
//     });
//   }

// }

edit_cat_cus(id)
{
this.id = id;

for(let item of this.categorey_list)
{
if(item.id == id)
{
this.editCat = this.formBuilder.group({
  categoryName:[item.categoryName],
  arabicName: [item.arabicName],
  
});
}


}
}
update_cat_cus()
{

if(!this.editCat.valid){
this.apiCall.showToast('Please Fill the mandatory field', 'Error', 'errorToastr')
return false;
}else{
var data = this.editCat.value;
data['id'] = this.id
var params = {
url : 'admin/editfaqCategory',
data : data
}
this.apiCall.commonPostService(params).subscribe((result: any)=>{

result = result.body;
if(result.error =="false")
{
  this.apiCall.showToast(result.message, 'Success', 'successToastr');
  $('#edit_categ_edit').modal('hide');
  this.ngOnInit();
}else{
  this.apiCall.showToast(result.message, 'Error', '')
}
});
}

}

del_cat_cus(id)
{
this.data.id = id
this.data.isDelete =1

var params = {
url: 'admin/deletefaqCategory',
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

faq_cus_status(event, id)
{

let stat = event.target.checked ? "true" : "false"; 
var data= {}
data['id']=id
data['status'] =stat

var param = 
{
url: 'admin/faqCategoryStatus',
data: data,  
}

this.apiCall.commonPostService(param).subscribe((response:any)=>{

if(response.body.error=="false")
{
this.apiCall.showToast(response.body.message, 'Success', 'successToastr');
$('#edit_categ').modal('hide');
this.ngOnInit();
}
else{
this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
}
});

}

// edit_cat_sto(id)
// {
//   this.id = id;

//   for(let item of this.categorey_list)
//   {
//     if(item.id == id)
//     {
//       this.editCatsto = this.formBuilder.group({
//         categoryName:[item.categoryName],
//         arabicName: [item.arabicName],
  
//       });
//     }

//   }
// }
// update_cat_sto()
// {
//   if(!this.editCatsto.valid){
//     this.apiCall.showToast('Please Fill the mandatory field', 'Error', 'errorToastr')
//     return false;
//   }else{
//     var data = this.editCatsto.value;
//     data['id'] = this.id
//     var params = {
//       url : 'admin/editfaqCategory',
//       data : data
//     }

//     this.apiCall.commonPostService(params).subscribe((result: any)=>{

//       result = result.body;
//       if(result.error =="false")
//       {
//         this.apiCall.showToast(result.message, 'Success', 'successToastr');
//         $('#edit_categ_edit_sto').modal('hide');
//         this.ngOnInit();
//       }else{
//         this.apiCall.showToast(result.message, 'Error', '')
//       }
//     });
//   }
// }

// del_cat_sto(id)
// {
//   this.data.id = id
//   this.data.isDelete =id

//   var params = {
//     url: 'admin/deletefaqCategory',
//     data: this.data

//   }

//   this.apiCall.commonPostService(params).subscribe((result:any)=>{
//     if(result.body.error=="false")
//     {

//       this.apiCall.showToast(result.body.message, 'Success', 'successToastr')
//       this.ngOnInit();
//      }
//      else{
//       this.apiCall.showToast(result.body.message, 'Error', '')
//      }
//  });
// }


}