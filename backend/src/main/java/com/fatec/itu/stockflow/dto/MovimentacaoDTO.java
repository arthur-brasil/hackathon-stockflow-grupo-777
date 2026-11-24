package com.fatec.itu.stockflow.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;

// Corpo do PATCH /api/produtos/{id}/movimentacao, ex.: {"tipo":"SAIDA","quantidade":3}
public record MovimentacaoDTO(

    @NotBlank(message = "O tipo é obrigatório")
    @Pattern(regexp = "ENTRADA|SAIDA", message = "O tipo deve ser ENTRADA ou SAIDA")
    String tipo,

    @NotNull(message = "A quantidade é obrigatória")
    @Positive(message = "A quantidade deve ser maior que zero")
    Integer quantidade
) {

}
