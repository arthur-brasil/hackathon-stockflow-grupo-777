package com.fatec.itu.stockflow;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class ProdutoControllerTests {

    @Autowired
    private MockMvc mvc;

    private static final String CADERNO = """
        {"nome": "Caderno", "descricao": "Caderno universitário", "categoria": "Papelaria",
         "quantidade": 10, "estoqueMinimo": 3}
        """;

    @Test
    void listaOsProdutosDoSeeding() throws Exception {
        mvc.perform(get("/api/produtos"))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$", hasSize(5)));
    }

    @Test
    void consultaPorIdEDevolve404QuandoNaoExiste() throws Exception {
        mvc.perform(get("/api/produtos/1"))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$.nome").value("Caneta azul"))
           .andExpect(jsonPath("$.estoqueBaixo").value(false));

        mvc.perform(get("/api/produtos/2"))
           .andExpect(jsonPath("$.estoqueBaixo").value(true));

        mvc.perform(get("/api/produtos/999"))
           .andExpect(status().isNotFound());
    }

    @Test
    void cadastraProdutoValido() throws Exception {
        mvc.perform(post("/api/produtos").contentType(MediaType.APPLICATION_JSON).content(CADERNO))
           .andExpect(status().isCreated())
           .andExpect(header().exists("Location"))
           .andExpect(jsonPath("$.id").value(6))
           .andExpect(jsonPath("$.estoqueBaixo").value(false));
    }

    @Test
    void recusaProdutoSemCamposObrigatorios() throws Exception {
        mvc.perform(post("/api/produtos").contentType(MediaType.APPLICATION_JSON).content("{}"))
           .andExpect(status().isBadRequest())
           .andExpect(jsonPath("$.erros", hasSize(4)));
    }

    @Test
    void recusaQuantidadeNegativa() throws Exception {
        String negativo = """
            {"nome": "X", "categoria": "Y", "quantidade": -1, "estoqueMinimo": -2}
            """;
        mvc.perform(post("/api/produtos").contentType(MediaType.APPLICATION_JSON).content(negativo))
           .andExpect(status().isBadRequest())
           .andExpect(jsonPath("$.erros", hasSize(2)));
    }

    @Test
    void editaProdutoEDevolve404QuandoNaoExiste() throws Exception {
        mvc.perform(put("/api/produtos/1").contentType(MediaType.APPLICATION_JSON).content(CADERNO))
           .andExpect(status().isNoContent());

        mvc.perform(get("/api/produtos/1"))
           .andExpect(jsonPath("$.nome").value("Caderno"));

        mvc.perform(put("/api/produtos/999").contentType(MediaType.APPLICATION_JSON).content(CADERNO))
           .andExpect(status().isNotFound());
    }

    @Test
    void excluiProdutoEDevolve404QuandoNaoExiste() throws Exception {
        mvc.perform(delete("/api/produtos/1"))
           .andExpect(status().isNoContent());

        mvc.perform(delete("/api/produtos/1"))
           .andExpect(status().isNotFound());
    }

    // Mesmo roteiro da demonstração obrigatória do enunciado
    @Test
    void fluxoDaDemonstracao() throws Exception {
        mvc.perform(post("/api/produtos").contentType(MediaType.APPLICATION_JSON).content(CADERNO))
           .andExpect(status().isCreated());

        mvc.perform(patch("/api/produtos/6/movimentacao").contentType(MediaType.APPLICATION_JSON)
                    .content("{\"tipo\":\"SAIDA\",\"quantidade\":8}"))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$.quantidade").value(2))
           .andExpect(jsonPath("$.estoqueBaixo").value(true));

        mvc.perform(patch("/api/produtos/6/movimentacao").contentType(MediaType.APPLICATION_JSON)
                    .content("{\"tipo\":\"SAIDA\",\"quantidade\":3}"))
           .andExpect(status().isBadRequest())
           .andExpect(jsonPath("$.erros[0]").value("Estoque insuficiente: saldo atual de 2 unidade(s)"));

        // A saída recusada não altera o saldo
        mvc.perform(get("/api/produtos/6"))
           .andExpect(jsonPath("$.quantidade").value(2));
    }

    @Test
    void registraEntrada() throws Exception {
        mvc.perform(patch("/api/produtos/2/movimentacao").contentType(MediaType.APPLICATION_JSON)
                    .content("{\"tipo\":\"ENTRADA\",\"quantidade\":10}"))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$.quantidade").value(14))
           .andExpect(jsonPath("$.estoqueBaixo").value(false));
    }

    @Test
    void recusaMovimentacaoInvalida() throws Exception {
        mvc.perform(patch("/api/produtos/1/movimentacao").contentType(MediaType.APPLICATION_JSON)
                    .content("{\"tipo\":\"TROCA\",\"quantidade\":0}"))
           .andExpect(status().isBadRequest())
           .andExpect(jsonPath("$.erros", hasSize(2)));

        mvc.perform(patch("/api/produtos/999/movimentacao").contentType(MediaType.APPLICATION_JSON)
                    .content("{\"tipo\":\"ENTRADA\",\"quantidade\":1}"))
           .andExpect(status().isNotFound());
    }

    @Test
    void recusaJsonQuebradoEIdNaoNumerico() throws Exception {
        mvc.perform(post("/api/produtos").contentType(MediaType.APPLICATION_JSON).content("{nome"))
           .andExpect(status().isBadRequest())
           .andExpect(jsonPath("$.erros[0]").value("O corpo da requisição deve ser um JSON válido"));

        mvc.perform(get("/api/produtos/abc"))
           .andExpect(status().isBadRequest())
           .andExpect(jsonPath("$.erros[0]").value("O id deve ser um número"));
    }
}
