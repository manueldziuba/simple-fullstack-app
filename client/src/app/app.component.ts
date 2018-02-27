import { Component } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Simple Fullstack App';

  isLoaded: Boolean = false;          // Indicator whether the data have been loaded (initially)
  tblEntries: Array<any> = [];        // Our table entries from the server's API
  tblSortColumn: String = 'id';       // The column to sort by
  tblSortOrder: String = 'asc';       // The sorting order
  tblFilterDateStart: Date = null;    // The filtering start date (or null)
  tblFilterDateEnd: Date = null;      // The filtering end date (or null)

  constructor(private apiService: ApiService) {}

  // Loading data from server
  private loadData() {
    this.apiService.loadData(this.tblSortColumn, this.tblSortOrder, this.tblFilterDateStart, this.tblFilterDateEnd)
    .subscribe(data => {
      this.isLoaded = true;
      this.tblEntries = data['data']
    });
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

  setFilterStartDate(event: MatDatepickerInputEvent<Date>) {
    this.tblFilterDateStart = event.value;
    if (this.tblFilterDateStart && this.tblFilterDateEnd) {
      this.loadData();
    }
  }

  setFilterEndDate(event: MatDatepickerInputEvent<Date>) {
    this.tblFilterDateEnd = event.value;
    if (this.tblFilterDateStart && this.tblFilterDateEnd) {
      this.loadData();
    }
  }

  clearFilterDates() {
    this.tblFilterDateStart = null;
    this.tblFilterDateEnd = null;
    this.loadData();
  }
}
