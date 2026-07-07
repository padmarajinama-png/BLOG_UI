import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BlogpostService } from '../../blogpost/services/blogpost-service';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  blogPostService=inject(BlogpostService);
blogPostRef=this.blogPostService.getAllBlogPosts();
isLoading=this.blogPostRef.isLoading;
blogPostResponse=this.blogPostRef.value;
}
