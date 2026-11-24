import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import EstoqueBadge from '../components/EstoqueBadge';
import { RootStackParamList } from '../navigation';
import { buscarProduto } from '../services/produtoService';
import { Produto } from '../types/produto';

type Props = NativeStackScreenProps<RootStackParamList, 'Detalhes'>;

export default function DetalhesScreen({ route, navigation }: Props) {
  const { id } = route.params;
  const [produto, setProduto] = useState<Produto | null>(null);
  const [erroCarregar, setErroCarregar] = useState('');

  useEffect(() => {
    buscarProduto(id)
      .then(setProduto)
      .catch((e: Error) => setErroCarregar(e.message));
  }, [id]);

  if (!produto) {
    return erroCarregar ? (
      <Text style={styles.erroTela}>{erroCarregar}</Text>
    ) : (
      <ActivityIndicator style={{ marginTop: 32 }} />
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>
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
  pressionado: { opacity: 0.6 },
  voltar: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#1d4ed8', borderRadius: 8, paddingVertical: 12, alignItems: 'center' },
  textoVoltar: { color: '#1d4ed8', fontWeight: '600', fontSize: 15 },
  erroTela: { backgroundColor: '#fee2e2', color: '#991b1b', padding: 12, margin: 16, borderRadius: 8 },
});
