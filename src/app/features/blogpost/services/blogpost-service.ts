import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { inject, Injectable, InputSignal } from '@angular/core';
import { AddBlogPostRequest, BlogPost, UpdateBlogPostRequest } from '../models/blogpost.model';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BlogpostService {
  http=inject(HttpClient);
  apiUrl=environment.apiUrl;
  addBlogpost(data: AddBlogPostRequest):Observable<BlogPost> {
    return this.http.post<BlogPost>(`${this.apiUrl}/api/blogpost`, data,{withCredentials:true});
  }
  getAllBlogPosts():HttpResourceRef<BlogPost[]|undefined>{
 
      return httpResource<BlogPost[]>(()=>`${this.apiUrl}/api/BlogPost`);        
  }
  getBlogPostById(id:InputSignal<string|undefined>):HttpResourceRef<BlogPost|undefined>{
    return httpResource<BlogPost>(()=>`${this.apiUrl}/api/blogpost/${id()}`);
  }
    editBlogPost(id:string, body:UpdateBlogPostRequest):Observable<BlogPost>{
    return this.http.put<BlogPost>(`${this.apiUrl}/api/blogpost/${id}`,body,{withCredentials:true});;
  }
  deleteBlogPost(id:string):Observable<BlogPost>{
    return this.http.delete<BlogPost>(`${this.apiUrl}/api/blogpost/${id}`,{withCredentials:true});;
  }
  getBlogPostByUrlHandle(urlHandle:InputSignal<string|undefined>):HttpResourceRef<BlogPost|undefined>{
 return httpResource<BlogPost>(()=>`${this.apiUrl}/api/blogpost/${urlHandle()}`);
 }


}