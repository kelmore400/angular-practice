import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { filter, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http: HttpClient) { }
  url: string = "https://fakestoreapi.com/products"

  getProducts({sortBy, page, category}: any) {
    const url = category ? `${this.url}/category/${category}` : this.url;
    return this.http.get(url).pipe(
      this._sortBy(sortBy),
      this._pageBy(page)
    );
  }

  _sortBy(sort: string|undefined) {
    return map((results: any) => {
      if(sort && sort !== 'default' ) {
        return results.sort((a: any, b: any) => (sort === "asc" ? a.price - b.price : b.price - a.price));
      } else {
        return results;
      }
    })
  }

  _pageBy = (page?: number) => map((results: any) => {
    if (page) {
      const startFrom = (page - 1) *4;
      return {
        products: results.slice(startFrom, startFrom + 4),
        total: results.length
      };
    }
    return { products: results, total: results.length }
  })

  getCategories() {
    return this.http.get(`${this.url}/categories`);
  }
}