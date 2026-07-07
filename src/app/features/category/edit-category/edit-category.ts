import { Component, effect, inject, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../services/category-service';
import { ActivatedRoute, Router } from '@angular/router';
import { EditCategoryRequest } from '../../models/category.model';

@Component({
  selector: 'app-edit-category',
  imports: [ReactiveFormsModule],
  templateUrl: './edit-category.html',
  styleUrl: './edit-category.css',
})
export class EditCategory {
  constructor(){
 effect(()=>{
 if(this.categoryService.updateCategoryStatus() === 'success'){
 this.router.navigate(['/admin/categories']);
 }
 if(this.categoryService.updateCategoryStatus() === 'error'){
 console.error('Error updating category');
 }
 });
}  
private categoryService =inject(CategoryService);
private route = inject(ActivatedRoute);
private router=inject(Router);
//id=this.route.snapshot.paramMap.get('id');
id=input<string>()
categoryResourceRef = this.categoryService.getCategoryById(this.id);
categoryResponse=this.categoryResourceRef.value;
effectRef=effect(()=>{
 this.editCategoryFormGroup.controls.name.patchValue(this.categoryResponse()?.name ?? '');
 this.editCategoryFormGroup.controls.urlHandle.setValue(this.categoryResponse()?.urlHandle ?? '');
 })
   editCategoryFormGroup= new FormGroup({
 name:new FormControl<string>('',{nonNullable:true, validators:[Validators.required, Validators.maxLength(100)] }),
 urlHandle:new FormControl<string>('',{nonNullable:true, validators:[Validators.required, Validators.maxLength(200)] }),
 });

 get nameFormControl(){
 return this.editCategoryFormGroup.controls.name;
 }

 get urlHandleFormControl(){
 return this.editCategoryFormGroup.controls.urlHandle;
 }
onSubmit(){
 const id=this.id();
 if(!this.editCategoryFormGroup.valid || !id){
 console.error('Form is invalid');
 return;
 }
 const formRawValue=this.editCategoryFormGroup.getRawValue();
 console.log(this.editCategoryFormGroup.getRawValue());
 console.log(this.id());

 const updateCategoryRequestDto: EditCategoryRequest = {
 name:formRawValue.name,
 urlHandle:formRawValue.urlHandle
 }

 this.categoryService.updateCategory(id,updateCategoryRequestDto);
 }
 deleteCategory(){
  const id=this.id();
  if(!id){
    console.error("Invalid Category-ID");
    return;
  }
  this.categoryService.deleteCategory(id).subscribe({
    next:()=>{
      this.router.navigate(['admin/categories']);
    
    },
    error:(error)=>{
      console.error("Error deleting category",error);
    }
  })
 }
 }


