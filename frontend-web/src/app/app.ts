import { Component, OnInit, inject, signal, viewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ProdutoForm } from './components/produto-form/produto-form';
import { ProdutoLista } from './components/produto-lista/produto-lista';
import { Produto, ProdutoRequest } from './models/produto';
import { ProdutoService } from './services/produto.service';

@Component({
  selector: 'app-root',
  imports: [ProdutoLista, ProdutoForm],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private readonly service = inject(ProdutoService);
  private readonly formulario = viewChild.required(ProdutoForm);

  protected readonly produtos = signal<Produto[]>([]);
  protected readonly emEdicao = signal<Produto | null>(null);
  protected readonly errosForm = signal<string[]>([]);
  protected readonly erro = signal('');
  protected readonly mensagem = signal('');

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

  salvar(produto: ProdutoRequest): void {
    this.errosForm.set([]);
    this.mensagem.set('');
    const editando = this.emEdicao();

    const requisicao: Observable<unknown> = editando
      ? this.service.update(editando.id, produto)
      : this.service.create(produto);

    requisicao.subscribe({
      next: () => {
        this.mensagem.set(editando ? 'Produto atualizado.' : 'Produto cadastrado.');
        this.emEdicao.set(null);
        this.formulario().resetar();
        this.carregar();
      },
      error: (e: HttpErrorResponse) => this.errosForm.set(this.lerErros(e))
    });
  }

  editar(produto: Produto): void {
    this.emEdicao.set(produto);
    this.errosForm.set([]);
    this.mensagem.set('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelarEdicao(): void {
    this.emEdicao.set(null);
    this.errosForm.set([]);
  }

  excluir(produto: Produto): void {
    this.mensagem.set('');
    this.service.delete(produto.id).subscribe({
      next: () => {
        this.mensagem.set(`Produto "${produto.nome}" excluído.`);
        if (this.emEdicao()?.id === produto.id) {
          this.emEdicao.set(null);
        }
        this.carregar();
      },
      error: (e: HttpErrorResponse) => this.erro.set(this.lerErros(e).join(' '))
    });
  }

  // A API devolve { status: 400, erros: [...] } ou { status: 404, mensagem: '...' }
  private lerErros(e: HttpErrorResponse): string[] {
    if (e.status === 0) {
      return ['Não foi possível conectar à API em http://localhost:8080.'];
    }
    if (Array.isArray(e.error?.erros)) {
      return e.error.erros;
    }
    if (e.error?.mensagem) {
      return [e.error.mensagem];
    }
    return [`Erro ${e.status} ao falar com a API.`];
  }
}
