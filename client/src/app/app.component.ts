import { Component } from '@angular/core';
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Simple Fullstack App';

  isDataLoaded: false;
  tblEntries = []; // Our table entries from the server's API
  tblSortColumn = 'id'; // The column to sort by
  tblSortOrder = 'asc';
  tblFilters = ''; // The dates to filter by

  constructor(private apiService: ApiService) {}

  // Loading data from server
  private loadData() {
    this.apiService.loadData(this.tblSortColumn, this.tblSortOrder)
    .subscribe(data => this.tblEntries = data['data']);
  }

  ngOnInit() {
    this.loadData();
  }

  sortBy(column) {
    if (column == this.tblSortColumn) {
      this.tblSortOrder = (this.tblSortOrder === 'asc') ? 'desc' : 'asc';
    } else {
      this.tblSortColumn = column;
      this.tblSortOrder = 'asc';
    }
    this.loadData();
  }
}
