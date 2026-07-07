import { Component, inject } from '@angular/core';
import { BlogpostService } from '../services/blogpost-service';
import { CategoryService } from '../../category/services/category-service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-blogpost-list',
  imports: [RouterLink],
  templateUrl: './blogpost-list.html',
  styleUrl: './blogpost-list.css',
})
export class BlogpostList {
blogpostService=inject(BlogpostService);
categoryService=inject(CategoryService);
 private categoriesResourceRef=this.categoryService.getCategory();
  categoriesResponse=this.categoriesResourceRef.value;
  getAllBlogPostRef=this.blogpostService.getAllBlogPosts();
  isLoading=this.getAllBlogPostRef.isLoading;
 error=this.getAllBlogPostRef.error;
 response=this.getAllBlogPostRef.value;
}
