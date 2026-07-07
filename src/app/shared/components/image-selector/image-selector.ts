import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ImageSelectorService } from '../../services/image-selector-service';
import { BlogImage } from '../../models/image.model';

@Component({
  selector: 'app-image-selector',
  imports: [ReactiveFormsModule],
  templateUrl: './image-selector.html',
  styleUrl: './image-selector.css',
})
export class ImageSelector {
  id=signal<string|undefined>(undefined);
  private ImageSelectorService=inject(ImageSelectorService);
  imagesRef=this.ImageSelectorService.getAllImages(this.id);
 isLoading=this.imagesRef.isLoading;
 images=this.imagesRef.value;
  showImageSelector=this.ImageSelectorService.showImageSelector.asReadonly();
   hideImageSelector() {
  this.ImageSelectorService.hideImageSelector();
}

  imageSelectorUploadForm=new FormGroup({
 file: new FormControl<File|null|undefined>(null,{
 nonNullable:true,
 validators:[Validators.required]
 }),
 name: new FormControl<string>('',{
 nonNullable:true,
 validators:[Validators.required,Validators.maxLength(100)]
 }),
 title: new FormControl<string>('',{
 nonNullable:true,
 validators:[Validators.required,Validators.maxLength(100)]
 }),
 });
 onSubmit(){
 if(this.imageSelectorUploadForm.valid){
 const formRawValue=this.imageSelectorUploadForm.getRawValue();
 console.log(formRawValue);
 this.ImageSelectorService.uploadImage(formRawValue.file!,formRawValue.name,formRawValue.title).subscribe({
 next:(response)=>{
 this.id.set(response.id);
 this.imageSelectorUploadForm.reset();
 console.log(response);
 },
 error:()=>{
 console.error('something went wrong');
 }
 });
 }
 }
 onFileSelected(event:Event){
  const input =event.target as HTMLInputElement;
  if(!input.files||input.files.length===0)
  {
    return;
  }
  const file=input.files[0];
  this.imageSelectorUploadForm.patchValue({file:file
  });
 }
 onSelectImage(image:BlogImage){
 this.ImageSelectorService.selectImage(image.url);
 }

}


