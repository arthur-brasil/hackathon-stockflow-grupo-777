package com.fatec.itu.stockflow.mapper;

import com.fatec.itu.stockflow.dto.ProdutoRequestDTO;
import com.fatec.itu.stockflow.dto.ProdutoResponseDTO;
import com.fatec.itu.stockflow.entity.Produto;

public class ProdutoMapper {

    public static Produto toEntity(ProdutoRequestDTO request) {
        Produto p = new Produto();
        p.setNome(request.nome());
        p.setDescricao(request.descricao());
        p.setCategoria(request.categoria());
        p.setQuantidade(request.quantidade());
        p.setEstoqueMinimo(request.estoqueMinimo());

        return p;
    }

    public static ProdutoResponseDTO toDTO(Produto produto) {
        return new ProdutoResponseDTO(
            produto.getId(),
            produto.getNome(),
            produto.getDescricao(),
            produto.getCategoria(),
            produto.getQuantidade(),
            produto.getEstoqueMinimo(),
            produto.getQuantidade() <= produto.getEstoqueMinimo()
        );
    }
}
