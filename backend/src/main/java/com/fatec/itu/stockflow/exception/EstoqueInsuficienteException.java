package com.fatec.itu.stockflow.exception;

// Lançada quando uma SAIDA deixaria o estoque negativo
public class EstoqueInsuficienteException extends RuntimeException {

    public EstoqueInsuficienteException(String mensagem) {
        super(mensagem);
    }
}
