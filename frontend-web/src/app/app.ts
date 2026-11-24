import { Component, OnInit, inject, signal } from '@angular/core';

import { ProdutoLista } from './components/produto-lista/produto-lista';
import { Produto } from './models/produto';
import { ProdutoService } from './services/produto.service';

@Component({
  selector: 'app-root',
  imports: [ProdutoLista],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private readonly service = inject(ProdutoService);

  protected readonly produtos = signal<Produto[]>([]);
  protected readonly erro = signal('');

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.service.getAll().subscribe({
      next: lista => {
        this.produtos.set(lista);
        this.erro.set('');
      },
      error: () => this.erro.set('Não foi possível conectar à API em http://localhost:8080.')
    });
  }

  // Editar e excluir entram na próxima etapa
  editar(produto: Produto): void {}

  excluir(produto: Produto): void {}
}
