import { Component, effect, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BlogpostService } from '../services/blogpost-service';
import { AddBlogPostRequest } from '../models/blogpost.model';
import { Router } from '@angular/router';
import { CategoryService } from '../../category/services/category-service';
import { MarkdownComponent } from 'ngx-markdown';
import { ImageSelectorService } from '../../../shared/services/image-selector-service';


@Component({
  selector: 'app-add-blogpost',
  imports: [ReactiveFormsModule,MarkdownComponent],
  templateUrl: './add-blogpost.html',
  styleUrl: './add-blogpost.css',
})
export class AddBlogpost {
  blogPostService=inject (BlogpostService);
  categoriesService=inject(CategoryService);
  imageSelectorService=inject(ImageSelectorService)
  Router=inject(Router);

  private categoriesResourceRef=this.categoriesService.getCategory();
  categoriesResponse=this.categoriesResourceRef.value;

  addBlogPostFormGroup= new FormGroup({
    title: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(200)] }),
    shortDescription: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(500)] }),
    content: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    featuredImageUrl: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(500)] }),
    urlHandle: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(200)] }),
    publishedDate: new FormControl<string>(new Date().toISOString().split('T')[0], { nonNullable: true, validators: [Validators.required] }),
    author: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(100)] }),
    isVisible: new FormControl<boolean>(true, { nonNullable: true }),
    categories: new FormControl<string[]>([]),
  });

 onSubmit() {
    if (!this.addBlogPostFormGroup.valid) {
           return;
    }
    const formRawValue = this.addBlogPostFormGroup.getRawValue();
    console.log(formRawValue);
    const requestDto: AddBlogPostRequest = {
        title: formRawValue.title,
        shortDescription: formRawValue.shortDescription,
        content: formRawValue.content,
        featuredImageUrl: formRawValue.featuredImageUrl,
        urlHandle: formRawValue.urlHandle,
        author: formRawValue.author,
        publishedDate: new Date(formRawValue.publishedDate),
        isVisible: formRawValue.isVisible,
        categories: []
    };
    this.blogPostService.addBlogpost(requestDto).subscribe({
      next: (response) => {
        console.log('Blog post created successfully:', response);
        
        this.Router.navigate(['/admin/blogposts']);
      },
      error: (error) => {
        console.error('Error creating blog post:', error);
   
      },
    });
  }
  selectedImageEffectRef=effect(()=>{
 const selectedImageUrl=this.imageSelectorService.selectedImage();
 if(selectedImageUrl){
 this.addBlogPostFormGroup.patchValue({
 featuredImageUrl:selectedImageUrl,
 });
 }
 });
}