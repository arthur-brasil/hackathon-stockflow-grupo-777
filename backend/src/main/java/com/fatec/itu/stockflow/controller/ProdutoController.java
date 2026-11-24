package com.fatec.itu.stockflow.controller;

import java.net.URI;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.fatec.itu.stockflow.dto.MovimentacaoDTO;
import com.fatec.itu.stockflow.dto.ProdutoRequestDTO;
import com.fatec.itu.stockflow.dto.ProdutoResponseDTO;
import com.fatec.itu.stockflow.entity.Produto;
import com.fatec.itu.stockflow.mapper.ProdutoMapper;
import com.fatec.itu.stockflow.service.ProdutoService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/produtos")
public class ProdutoController {

    private final ProdutoService service;

    ProdutoController(ProdutoService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<ProdutoResponseDTO>> getAll() {
        List<ProdutoResponseDTO> produtos = service.getAll()
                                                   .stream()
                                                   .map(ProdutoMapper::toDTO)
                                                   .toList();
        return ResponseEntity.ok(produtos);
    }

    @GetMapping("{id}")
    public ResponseEntity<ProdutoResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ProdutoMapper.toDTO(service.getById(id)));
    }

    @PostMapping
    public ResponseEntity<ProdutoResponseDTO> create(@Valid @RequestBody ProdutoRequestDTO request) {
        Produto p = service.create(ProdutoMapper.toEntity(request));
        ProdutoResponseDTO response = ProdutoMapper.toDTO(p);

        URI location = ServletUriComponentsBuilder
                       .fromCurrentRequest()
                       .path("/{id}")
                       .buildAndExpand(response.id())
                       .toUri();

        return ResponseEntity.created(location).body(response);
    }

    @PutMapping("{id}")
    public ResponseEntity<Void> update(@PathVariable Long id,
                                       @Valid @RequestBody ProdutoRequestDTO request) {
        service.update(id, ProdutoMapper.toEntity(request));
        return ResponseEntity.noContent().build();
    }

    // Devolve o produto com o novo saldo, para a tela mostrar na hora
    @PatchMapping("{id}/movimentacao")
    public ResponseEntity<ProdutoResponseDTO> movimentar(@PathVariable Long id,
                                                         @Valid @RequestBody MovimentacaoDTO request) {
        Produto p = service.movimentar(id, request.tipo(), request.quantidade());
        return ResponseEntity.ok(ProdutoMapper.toDTO(p));
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
