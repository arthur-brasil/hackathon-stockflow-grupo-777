import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Produto, ProdutoRequest } from '../models/produto';

@Injectable({ providedIn: 'root' })
export class ProdutoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/produtos';

  getAll(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.apiUrl);
  }

  create(produto: ProdutoRequest): Observable<Produto> {
    return this.http.post<Produto>(this.apiUrl, produto);
  }

  update(id: number, produto: ProdutoRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, produto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
