package com.fatec.itu.stockflow.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fatec.itu.stockflow.entity.Produto;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {

}
