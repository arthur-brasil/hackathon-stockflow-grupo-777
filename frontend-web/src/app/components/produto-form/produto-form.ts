import { Component, effect, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Produto, ProdutoRequest } from '../../models/produto';

@Component({
  selector: 'app-produto-form',
  imports: [FormsModule],
  templateUrl: './produto-form.html',
  styleUrl: './produto-form.css'
})
export class ProdutoForm {
  // Produto em edição (null = cadastro novo)
  readonly produto = input<Produto | null>(null);
  readonly erros = input<string[]>([]);

  readonly salvar = output<ProdutoRequest>();
  readonly cancelar = output<void>();

  protected form: ProdutoRequest = this.formVazio();

  constructor() {
    // Sempre que o produto em edição mudar, preenche (ou limpa) o formulário
    effect(() => {
      const p = this.produto();
      this.form = p
        ? {
            nome: p.nome,
            descricao: p.descricao,
            categoria: p.categoria,
            quantidade: p.quantidade,
            estoqueMinimo: p.estoqueMinimo
          }
        : this.formVazio();
    });
  }

  enviar(): void {
    this.salvar.emit({ ...this.form, descricao: this.form.descricao?.trim() || null });
  }

  limpar(): void {
    this.resetar();
    this.cancelar.emit();
  }

  // Chamado pelo App depois que a API confirma o cadastro
  resetar(): void {
    this.form = this.formVazio();
  }

  private formVazio(): ProdutoRequest {
    return { nome: '', descricao: '', categoria: '', quantidade: null, estoqueMinimo: null };
  }
}
