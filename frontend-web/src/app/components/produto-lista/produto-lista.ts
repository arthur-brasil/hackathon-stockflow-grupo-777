import { Component, computed, input, output, signal } from '@angular/core';

import { Produto } from '../../models/produto';

@Component({
  selector: 'app-produto-lista',
  templateUrl: './produto-lista.html',
  styleUrl: './produto-lista.css'
})
export class ProdutoLista {
  readonly produtos = input.required<Produto[]>();
  readonly editar = output<Produto>();
  readonly excluir = output<Produto>();

  // Filtros escolhidos na tela
  protected readonly categoria = signal('TODAS');
  protected readonly soEstoqueBaixo = signal(false);

  // Id do produto que está pedindo confirmação de exclusão
  protected readonly confirmando = signal<number | null>(null);

  // Categorias que existem nos produtos, sem repetir e em ordem alfabética
  protected readonly categorias = computed(() =>
    [...new Set(this.produtos().map(p => p.categoria))].sort((a, b) => a.localeCompare(b))
  );

  protected readonly qtdEstoqueBaixo = computed(() => this.produtos().filter(p => p.estoqueBaixo).length);

  // Lista que aparece na tela, já filtrada
  protected readonly visiveis = computed(() =>
    this.produtos().filter(p =>
      (this.categoria() === 'TODAS' || p.categoria === this.categoria()) &&
      (!this.soEstoqueBaixo() || p.estoqueBaixo)
    )
  );

  protected trocarCategoria(evento: Event): void {
    this.categoria.set((evento.target as HTMLSelectElement).value);
  }

  protected trocarEstoqueBaixo(evento: Event): void {
    this.soEstoqueBaixo.set((evento.target as HTMLInputElement).checked);
  }

  protected confirmarExclusao(p: Produto): void {
    this.confirmando.set(null);
    this.excluir.emit(p);
  }
}
