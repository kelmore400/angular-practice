import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from './products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private productsService: ProductsService) { }

  products: any[]=[];
  categories: any[]=[];
  currentCategory: string|null = null;
  sortBy: string = 'default';
  pages: number[] = [];
  currentPage: number = 1;

  getCategories() {
    this.productsService.getCategories().subscribe((data: any) => {
      this.categories = data;
    })
  }

  filter(category: string) {
    this.doNavigation({category, page: 1});
  }

  getParams() {
    let category: string | null = null;
    let page: string | null = null;
    let sortBy: string | null = null;
    this.activatedRoute.params.forEach(param => category = param['category']);
    this.activatedRoute.queryParams.forEach(param => page = param['page']);
    this.activatedRoute.queryParams.forEach(param => sortBy = param['sortBy']);
    return {category, page: page||1, sortBy};
  }

  setProducts({products, total}: any) {
    this.products = products;
    this.pages = new Array(Math.ceil(total/4)).fill(0).map((x,i) => i + 1);
  }

  getProducts({category, sortBy, page}: any) {
    this.productsService.getProducts({category, sortBy, page}).subscribe((data: any) => {
      this.setProducts(data);
      if(category) {
        this.currentCategory = category;
      }
    })
  }

  sortByPrice($event: any) {
    this.sortBy = $event.target.value;
    this.doNavigation({sortBy: this.sortBy});
  }

  doNavigation({ category, sortBy, page }: any) {
    const queryParams: any = {};
    if (sortBy) {
      queryParams['sortBy'] = sortBy;
    }
    if (page || this.currentPage) {
      queryParams['page'] = page || this.currentPage;
    }
    const commands = ['products'];
    if (category || this.currentCategory) {
      commands.push(category || this.currentCategory)
    }
    this.router.navigate(commands, { queryParams });
    this.getProducts({category: category || this.currentCategory, sortBy: this.sortBy, page: page || this.currentPage});
  }

  changePage($event: any, page: number) {
    $event.preventDefault();
    this.currentPage = page;
    this.doNavigation({page});
  }
  
  ngOnInit(): void {
    this.getCategories();
    this.getProducts(this.getParams());
  }

}
