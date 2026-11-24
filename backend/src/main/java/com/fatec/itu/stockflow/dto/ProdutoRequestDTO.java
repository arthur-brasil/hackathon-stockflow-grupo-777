package com.fatec.itu.stockflow.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public record ProdutoRequestDTO(

    @NotBlank(message = "O nome é obrigatório")
    @Size(max = 100, message = "O nome deve ter no máximo 100 caracteres")
    String nome,

    @Size(max = 500, message = "A descrição deve ter no máximo 500 caracteres")
    String descricao,

    @NotBlank(message = "A categoria é obrigatória")
    @Size(max = 50, message = "A categoria deve ter no máximo 50 caracteres")
    String categoria,

    @NotNull(message = "A quantidade é obrigatória")
    @PositiveOrZero(message = "A quantidade deve ser maior ou igual a zero")
    Integer quantidade,

    @NotNull(message = "O estoque mínimo é obrigatório")
    @PositiveOrZero(message = "O estoque mínimo deve ser maior ou igual a zero")
    Integer estoqueMinimo
) {

}
