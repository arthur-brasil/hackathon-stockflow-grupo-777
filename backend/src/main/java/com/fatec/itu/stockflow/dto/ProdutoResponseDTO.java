package com.fatec.itu.stockflow.dto;

public record ProdutoResponseDTO(
    Long id,
    String nome,
    String descricao,
    String categoria,
    Integer quantidade,
    Integer estoqueMinimo,
    // true quando quantidade <= estoqueMinimo
    boolean estoqueBaixo
) {

}
