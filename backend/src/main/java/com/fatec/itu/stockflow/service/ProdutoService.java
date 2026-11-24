package com.fatec.itu.stockflow.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.fatec.itu.stockflow.entity.Produto;
import com.fatec.itu.stockflow.exception.EstoqueInsuficienteException;
import com.fatec.itu.stockflow.repository.ProdutoRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class ProdutoService {

    private final ProdutoRepository repository;

    ProdutoService(ProdutoRepository repository) {
        this.repository = repository;
    }

    public List<Produto> getAll() {
        return repository.findAll();
    }

    public Produto getById(Long id) {
        return repository.findById(id)
                         .orElseThrow(() -> new EntityNotFoundException("Produto não encontrado"));
    }

    public Produto create(Produto produto) {
        return repository.save(produto);
    }

    public void update(Long id, Produto produto) {
        Produto p = getById(id);

        p.setNome(produto.getNome());
        p.setDescricao(produto.getDescricao());
        p.setCategoria(produto.getCategoria());
        p.setQuantidade(produto.getQuantidade());
        p.setEstoqueMinimo(produto.getEstoqueMinimo());

        repository.save(p);
    }

    // ENTRADA soma no saldo; SAIDA subtrai, mas nunca deixa o saldo negativo
    public Produto movimentar(Long id, String tipo, Integer quantidade) {
        Produto p = getById(id);

        if (tipo.equals("SAIDA")) {
            if (quantidade > p.getQuantidade()) {
                throw new EstoqueInsuficienteException(
                    "Estoque insuficiente: saldo atual de " + p.getQuantidade() + " unidade(s)");
            }
            p.setQuantidade(p.getQuantidade() - quantidade);
        } else {
            p.setQuantidade(p.getQuantidade() + quantidade);
        }

        return repository.save(p);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new EntityNotFoundException("Produto não encontrado");
        }
        repository.deleteById(id);
    }
}
