import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ApiService {

  private apiUrl = 'http://localhost:5000/api/data';

  constructor(private http: HttpClient) { }

  loadData(sortColumn, sortOrder) {
    return this.http.get(`${this.apiUrl}?sort=${sortColumn}&order=${sortOrder}`);
  }
}
