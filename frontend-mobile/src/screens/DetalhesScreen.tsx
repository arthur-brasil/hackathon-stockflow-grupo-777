import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import EstoqueBadge from '../components/EstoqueBadge';
import { RootStackParamList } from '../navigation';
import { buscarProduto, movimentar } from '../services/produtoService';
import { Produto, TipoMovimentacao } from '../types/produto';

type Props = NativeStackScreenProps<RootStackParamList, 'Detalhes'>;

const TIPOS: { valor: TipoMovimentacao; rotulo: string }[] = [
  { valor: 'ENTRADA', rotulo: 'Entrada' },
  { valor: 'SAIDA', rotulo: 'Saída' },
];

export default function DetalhesScreen({ route, navigation }: Props) {
  const { id } = route.params;
  const [produto, setProduto] = useState<Produto | null>(null);
  const [erroCarregar, setErroCarregar] = useState('');

  // Formulário de movimentação
  const [tipo, setTipo] = useState<TipoMovimentacao>('SAIDA');
  const [quantidade, setQuantidade] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  useEffect(() => {
    buscarProduto(id)
      .then(setProduto)
      .catch((e: Error) => setErroCarregar(e.message));
  }, [id]);

  async function registrar() {
    if (!produto) {
      return;
    }
    setMensagem('');
    setErro('');

    const qtd = Number(quantidade);
    if (!Number.isInteger(qtd) || qtd <= 0) {
      setErro('Informe uma quantidade inteira maior que zero.');
      return;
    }

    setSalvando(true);
    try {
      // A API devolve o produto já com o novo saldo
      const atualizado = await movimentar(produto.id, tipo, qtd);
      setProduto(atualizado);
      setQuantidade('');
      setMensagem(`${tipo === 'ENTRADA' ? 'Entrada' : 'Saída'} de ${qtd} registrada. Novo saldo: ${atualizado.quantidade}.`);
    } catch (e) {
      // Ex.: saída maior que o saldo -> "Estoque insuficiente: saldo atual de 2 unidade(s)"
      setErro((e as Error).message);
    } finally {
      setSalvando(false);
    }
  }

  if (!produto) {
    return erroCarregar ? (
      <Text style={styles.erroTela}>{erroCarregar}</Text>
    ) : (
      <ActivityIndicator style={{ marginTop: 32 }} />
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
      <Text style={styles.id}>Produto #{produto.id}</Text>
      <Text style={styles.nome}>{produto.nome}</Text>
      <EstoqueBadge baixo={produto.estoqueBaixo} />

      <View style={styles.linha}>
        <View style={[styles.bloco, styles.metade, produto.estoqueBaixo && styles.blocoBaixo]}>
          <Text style={styles.rotulo}>Saldo</Text>
          <Text style={[styles.numero, produto.estoqueBaixo && styles.numeroBaixo]}>{produto.quantidade}</Text>
        </View>
        <View style={[styles.bloco, styles.metade]}>
          <Text style={styles.rotulo}>Estoque mínimo</Text>
          <Text style={styles.numero}>{produto.estoqueMinimo}</Text>
        </View>
      </View>

      <View style={styles.bloco}>
        <Text style={styles.rotulo}>Categoria</Text>
        <Text style={styles.valor}>{produto.categoria}</Text>
        <Text style={[styles.rotulo, { marginTop: 8 }]}>Descrição</Text>
        <Text style={styles.valor}>{produto.descricao || 'Sem descrição'}</Text>
      </View>

      <View style={styles.bloco}>
        <Text style={styles.rotulo}>Registrar movimentação</Text>
        <View style={styles.opcoes}>
          {TIPOS.map((t) => {
            const atual = t.valor === tipo;
            return (
              <Pressable
                key={t.valor}
                onPress={() => setTipo(t.valor)}
                style={({ pressed }) => [styles.opcao, atual && styles.opcaoAtual, pressed && styles.pressionado]}
              >
                <Text style={[styles.textoOpcao, atual && styles.textoOpcaoAtual]}>{t.rotulo}</Text>
              </Pressable>
            );
          })}
        </View>

        <TextInput
          style={styles.input}
          value={quantidade}
          onChangeText={setQuantidade}
          keyboardType="number-pad"
          placeholder="Quantidade"
          placeholderTextColor="#98a2b3"
        />

        <Pressable
          disabled={salvando}
          onPress={registrar}
          style={({ pressed }) => [styles.botao, (pressed || salvando) && styles.pressionado]}
        >
          <Text style={styles.textoBotao}>Registrar {tipo === 'ENTRADA' ? 'entrada' : 'saída'}</Text>
        </Pressable>

        {salvando ? <ActivityIndicator style={{ marginTop: 8 }} /> : null}
        {mensagem ? <Text style={styles.sucesso}>{mensagem}</Text> : null}
        {erro ? <Text style={styles.erro}>{erro}</Text> : null}
      </View>

      <Pressable
        onPress={() => navigation.popTo('Lista')}
        style={({ pressed }) => [styles.voltar, pressed && styles.pressionado]}
      >
        <Text style={styles.textoVoltar}>Voltar para a lista</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6fa' },
  conteudo: { padding: 16, gap: 12 },
  id: { color: '#98a2b3', fontSize: 13 },
  nome: { fontSize: 22, fontWeight: '700', color: '#101828' },
  linha: { flexDirection: 'row', gap: 12 },
  bloco: { backgroundColor: '#fff', borderRadius: 10, padding: 14, gap: 4, borderWidth: 1, borderColor: '#eef0f3' },
  blocoBaixo: { borderColor: '#fda29b', backgroundColor: '#fff4f2' },
  metade: { flex: 1 },
  rotulo: { fontSize: 12, fontWeight: '600', color: '#667085' },
  valor: { fontSize: 15, color: '#101828' },
  numero: { fontSize: 28, fontWeight: '700', color: '#101828' },
  numeroBaixo: { color: '#b42318' },
  opcoes: { flexDirection: 'row', gap: 8, marginTop: 6 },
  opcao: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d0d5dd',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  opcaoAtual: { backgroundColor: '#e6edff', borderColor: '#1d4ed8' },
  textoOpcao: { fontWeight: '600', color: '#344054' },
  textoOpcaoAtual: { color: '#1d4ed8' },
  input: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#d0d5dd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#101828',
    backgroundColor: '#fff',
  },
  botao: { marginTop: 10, backgroundColor: '#1d4ed8', borderRadius: 8, paddingVertical: 12, alignItems: 'center' },
  textoBotao: { color: '#fff', fontWeight: '600', fontSize: 15 },
  pressionado: { opacity: 0.6 },
  voltar: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#1d4ed8', borderRadius: 8, paddingVertical: 12, alignItems: 'center' },
  textoVoltar: { color: '#1d4ed8', fontWeight: '600', fontSize: 15 },
  sucesso: { color: '#166534', marginTop: 8 },
  erro: { backgroundColor: '#fee2e2', color: '#991b1b', padding: 10, borderRadius: 8, marginTop: 8 },
  erroTela: { backgroundColor: '#fee2e2', color: '#991b1b', padding: 12, margin: 16, borderRadius: 8 },
});
