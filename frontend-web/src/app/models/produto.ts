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

// Corpo enviado no POST e no PUT (sem o id e sem o estoqueBaixo, que a API calcula)
export interface ProdutoRequest {
  nome: string;
  descricao: string | null;
  categoria: string;
  quantidade: number | null;
  estoqueMinimo: number | null;
}
