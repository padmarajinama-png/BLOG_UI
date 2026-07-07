import { Component, effect, inject, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MarkdownComponent } from 'ngx-markdown';
import { CategoryService } from '../../category/services/category-service';
import { BlogpostService } from '../services/blogpost-service';
import { UpdateBlogPostRequest } from '../models/blogpost.model';
import { ImageSelector } from '../../../shared/components/image-selector/image-selector';
import { ImageSelectorService } from '../../../shared/services/image-selector-service';

@Component({
  selector: 'app-edit-blogpost',
  imports: [ReactiveFormsModule, MarkdownComponent, ImageSelector],
  templateUrl: './edit-blogpost.html',
  styleUrl: './edit-blogpost.css',
})
export class EditBlogpost {
  id = input<string>();

  blogPostService = inject(BlogpostService);
  categoryService = inject(CategoryService);
  imageSelectorService = inject(ImageSelectorService);
  router = inject(Router);

  private blogPostRef = this.blogPostService.getBlogPostById(this.id);
  blogPostResponse = this.blogPostRef.value;

  private categoriesRef = this.categoryService.getCategory();
  categoriesResponse = this.categoriesRef.value;

  editBlogPostFormGroup = new FormGroup({
    title: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(200)]
    }),
    shortDescription: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(500)]
    }),
    content: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    featuredImageUrl: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(500)]
    }),
    urlHandle: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(200)]
    }),
    publishedDate: new FormControl<string>(
      new Date().toISOString().split('T')[0],
      {
        nonNullable: true,
        validators: [Validators.required]
      }
    ),
    author: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(100)]
    }),
    isVisible: new FormControl<boolean>(true, {
      nonNullable: true
    }),
    categories: new FormControl<string[]>([]),
  });

  onSubmit() {
    const id = this.id();

    if (id && this.editBlogPostFormGroup.valid) {
      const formValue = this.editBlogPostFormGroup.getRawValue();

      const updateBlogPostRequestDto: UpdateBlogPostRequest = {
        title: formValue.title,
        shortDescription: formValue.shortDescription,
        content: formValue.content,
        author: formValue.author,
        featuredImageUrl: formValue.featuredImageUrl,
        isVisible: formValue.isVisible,
        publishedDate: new Date(formValue.publishedDate),
        urlHandle: formValue.urlHandle,
        categories: formValue.categories ?? [],
      };

      this.blogPostService.editBlogPost(id, updateBlogPostRequestDto).subscribe({
        next: () => {
          console.log('success');
          this.router.navigate(['/admin/blogposts']);
        },
        error: () => {
          console.log('something went wrong');
        }
      });
    }
  }

  onDelete() {
    const id = this.id();

    if (id) {
      this.blogPostService.deleteBlogPost(id).subscribe({
        next: () => {
          console.log('success');
          this.router.navigate(['/admin/blogposts']);
        },
        error: () => {
          console.log('something went wrong');
        }
      });
    }
  }

  openImageSelector() {
    this.imageSelectorService.displayImageSelector();
  }

  effectRef = effect(() => {
    if (this.blogPostResponse()) {
      this.editBlogPostFormGroup.patchValue({
        title: this.blogPostResponse()?.title,
        shortDescription: this.blogPostResponse()?.shortDescription,
        content: this.blogPostResponse()?.content,
        author: this.blogPostResponse()?.author,
        featuredImageUrl: this.blogPostResponse()?.featuredImageUrl,
        isVisible: this.blogPostResponse()?.isVisible,
        publishedDate: new Date(
          this.blogPostResponse()?.publishedDate!
        ).toISOString().split('T')[0],
        urlHandle: this.blogPostResponse()?.urlHandle,
        categories: this.blogPostResponse()?.categories.map(x => x.id),
      });
    }
  });

  imageSelectionEffect = effect(() => {
    const selectedImage = this.imageSelectorService.selectedImage();

    if (selectedImage) {
      this.editBlogPostFormGroup.patchValue({
        featuredImageUrl: selectedImage
      });
    }
  });
}