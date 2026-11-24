import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { App } from './app';

const API = 'http://localhost:8080/api/produtos';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();
  });

  it('lista os produtos da API, destaca estoque baixo e filtra', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    TestBed.inject(HttpTestingController).expectOne(API).flush([
      { id: 1, nome: 'Caneta', descricao: null, categoria: 'Papelaria', quantidade: 50, estoqueMinimo: 10, estoqueBaixo: false },
      { id: 2, nome: 'Caderno', descricao: null, categoria: 'Papelaria', quantidade: 2, estoqueMinimo: 3, estoqueBaixo: true },
      { id: 3, nome: 'Mouse', descricao: null, categoria: 'Informática', quantidade: 12, estoqueMinimo: 3, estoqueBaixo: false }
    ]);
    await fixture.whenStable();

    const tela = fixture.nativeElement as HTMLElement;
    expect(tela.querySelectorAll('tbody tr').length).toBe(3);
    expect(tela.querySelectorAll('tbody tr.baixo').length).toBe(1);
    expect(tela.querySelector('tr.baixo')?.textContent).toContain('Estoque baixo');

    const select = tela.querySelector('.filtros select') as HTMLSelectElement;
    select.value = 'Informática';
    select.dispatchEvent(new Event('change'));
    await fixture.whenStable();
    expect(tela.querySelectorAll('tbody tr').length).toBe(1);
    expect(tela.querySelector('tbody')?.textContent).toContain('Mouse');

    select.value = 'TODAS';
    select.dispatchEvent(new Event('change'));
    const check = tela.querySelector('.filtros input[type=checkbox]') as HTMLInputElement;
    check.click();
    await fixture.whenStable();
    expect(tela.querySelectorAll('tbody tr').length).toBe(1);
    expect(tela.querySelector('tbody')?.textContent).toContain('Caderno');
  });

  it('mostra as mensagens de validação que a API devolve no 400', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const http = TestBed.inject(HttpTestingController);
    http.expectOne(API).flush([]);
    await fixture.whenStable();

    const tela = fixture.nativeElement as HTMLElement;
    (tela.querySelector('button[type=submit]') as HTMLButtonElement).click();

    const post = http.expectOne({ method: 'POST', url: API });
    post.flush({ status: 400, erros: ['O nome é obrigatório'] }, { status: 400, statusText: 'Bad Request' });
    await fixture.whenStable();

    expect(tela.querySelector('.erros')?.textContent).toContain('O nome é obrigatório');
  });
});
