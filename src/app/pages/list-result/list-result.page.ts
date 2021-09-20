import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-list-result',
  templateUrl: './list-result.page.html',
  styleUrls: ['./list-result.page.scss'],
})
export class ListResultPage implements OnInit {

  public restaurants: any;
  public restaurantsAux: any;
  public searchTerm: any;

  constructor(    
    private route: ActivatedRoute, 
    private router: Router, 
    ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.restaurants = this.router.getCurrentNavigation().extras.state.item;
        console.log(this.restaurants);
        this.restaurants.forEach(element => {
          element.images = JSON.parse(element.images);
        });
        this.restaurantsAux = this.restaurants;
      }
    });
  }

  setFilteredItems() {
    this.restaurantsAux = this.filterItems(this.searchTerm);
  }


  filterItems(searchTerm){
    return this.restaurants.filter(item => {
      return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }

  back(){
    this.restaurantsAux = null;
    this.restaurants = null;
  }

}
