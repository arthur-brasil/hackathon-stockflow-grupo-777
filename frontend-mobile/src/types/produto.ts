export interface Produto {
  id: number;
  nome: string;
  descricao: string | null;
  categoria: string;
  quantidade: number;
  estoqueMinimo: number;
  // Calculado pela API: quantidade <= estoqueMinimo
  estoqueBaixo: boolean;
}

export type TipoMovimentacao = 'ENTRADA' | 'SAIDA';
