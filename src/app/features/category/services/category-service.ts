import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, InputSignal, signal } from '@angular/core';
import { AddCategoryRequest,Category, EditCategoryRequest } from '../../models/category.model';

import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  http = inject(HttpClient);
  apiUrl = environment.apiUrl;

  addCategoryStatus = signal<'idle' | 'loading' | 'success' | 'error'>('idle');
  updateCategoryStatus = signal<'idle' | 'loading' | 'success' | 'error'>('idle');
 addCategory(category: AddCategoryRequest){
 this.addCategoryStatus.set('loading');
 this.http.post<void>(`${this.apiUrl}/api/Categories`, category, { withCredentials: true }).subscribe({
 next:()=>{
 this.addCategoryStatus.set('success');
 },
 error:(error)=>{
 this.addCategoryStatus.set('error');
 }
 });
 }
  
getCategory(){
  return httpResource<Category[]>(()=>`${this.apiUrl}/api/Categories`);

}
getCategoryById(id:InputSignal<string|undefined>) {
  return httpResource<Category>(
    () => `${this.apiUrl}/api/Categories/${id()}`
  );
}
updateCategory(id:string, updateCategoryRequestDto: EditCategoryRequest){
 this.updateCategoryStatus.set('loading');
 return this.http.put<void>(`${this.apiUrl}/api/Categories/${id}`, updateCategoryRequestDto, {
  withCredentials: true 
})
 .subscribe({
 next:()=>{
 this.updateCategoryStatus.set('success');
 },
 error:(error)=>{
 this.updateCategoryStatus.set('error');
 }
 })
 }
  deleteCategory(id:string):Observable<void>{
   return this.http.delete<void>(`${this.apiUrl}/api/Categories/${id}`,
     { withCredentials: true });
  }

}

