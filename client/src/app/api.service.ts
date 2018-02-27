import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';

@Injectable()
export class ApiService {

  private apiUrl = 'http://localhost:5000/api/data';

  constructor(private http: HttpClient) { }

  loadData(sortColumn, sortOrder, filterDateStart, filterDateEnd) {
    const params = [ `sort=${sortColumn}:${sortOrder}` ]
    if (filterDateStart && filterDateEnd) {
      filterDateStart = moment(filterDateStart).format('YYYY-MM-DD');
      filterDateEnd = moment(filterDateEnd).format('YYYY-MM-DD');
      params.push(`filter=${filterDateStart},${filterDateEnd}`)
    }
    return this.http.get(`${this.apiUrl}?${params.join('&')}`);
  }
}
