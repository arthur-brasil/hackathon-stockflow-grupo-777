import { Platform } from 'react-native';

import { Produto, TipoMovimentacao } from '../types/produto';

// No celular, "localhost" é o próprio celular: use o IP do computador na rede,
// colocando EXPO_PUBLIC_API_URL=http://SEU_IP:8080 no arquivo .env (veja o .env.example).
// No emulador Android, 10.0.2.2 aponta para o computador.
const URL_PADRAO = Platform.OS === 'android' ? 'http://10.0.2.2:8080' : 'http://localhost:8080';

export const API_URL = `${process.env.EXPO_PUBLIC_API_URL ?? URL_PADRAO}/api/produtos`;

// Se a API devolver erro, lança a mensagem que ela mandou
// (ex.: "Estoque insuficiente: saldo atual de 2 unidade(s)")
async function verificar(resposta: Response): Promise<Response> {
  if (!resposta.ok) {
    const corpo = await resposta.json().catch(() => null);
    const mensagem = corpo?.erros?.join('\n') ?? corpo?.mensagem ?? `Erro ${resposta.status}`;
    throw new Error(mensagem);
  }
  return resposta;
}

export async function listarProdutos(): Promise<Produto[]> {
  const resposta = await verificar(await fetch(API_URL));
  return resposta.json();
}

export async function buscarProduto(id: number): Promise<Produto> {
  const resposta = await verificar(await fetch(`${API_URL}/${id}`));
  return resposta.json();
}

// PATCH /api/produtos/{id}/movimentacao — a API devolve o produto com o novo saldo
export async function movimentar(id: number, tipo: TipoMovimentacao, quantidade: number): Promise<Produto> {
  const resposta = await verificar(
    await fetch(`${API_URL}/${id}/movimentacao`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tipo, quantidade }),
    })
  );
  return resposta.json();
}
