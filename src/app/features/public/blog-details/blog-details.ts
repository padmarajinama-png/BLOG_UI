import { Component, inject, input } from '@angular/core';
import { BlogpostService } from '../../blogpost/services/blogpost-service';
import { MarkdownComponent } from 'ngx-markdown';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-blog-details',
  imports: [MarkdownComponent,DatePipe],
  templateUrl: './blog-details.html',
  styleUrl: './blog-details.css',
})
export class BlogDetails {
  url=input<string|undefined>();
  blogPostService=inject(BlogpostService);
blogPostRef=this.blogPostService.getBlogPostByUrlHandle(this.url);
isLoading=this.blogPostRef.isLoading;
blogDetailsResponse=this.blogPostRef.value;
}
