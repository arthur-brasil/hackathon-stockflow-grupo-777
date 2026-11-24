import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import EstoqueBadge from '../components/EstoqueBadge';
import { RootStackParamList } from '../navigation';
import { API_URL, listarProdutos } from '../services/produtoService';
import { Produto } from '../types/produto';

type Props = NativeStackScreenProps<RootStackParamList, 'Lista'>;

export default function ListaScreen({ navigation }: Props) {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const carregar = useCallback(async () => {
    setCarregando(true);
    try {
      setProdutos(await listarProdutos());
      setErro('');
    } catch {
      setErro(`Não foi possível conectar à API em ${API_URL}.`);
    } finally {
      setCarregando(false);
    }
  }, []);

  // Recarrega sempre que a tela volta a aparecer (ex.: depois de uma movimentação nos detalhes)
  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  return (
    <View style={styles.container}>
      {erro ? <Text style={styles.erro}>{erro}</Text> : null}

      <FlatList
        data={produtos}
        keyExtractor={(p) => String(p.id)}
        refreshing={carregando}
        onRefresh={carregar}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={
          carregando ? <ActivityIndicator /> : <Text style={styles.vazio}>Nenhum produto cadastrado.</Text>
        }
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [styles.card, item.estoqueBaixo && styles.cardBaixo, pressed && styles.pressionado]}
            onPress={() => navigation.navigate('Detalhes', { id: item.id })}
          >
            <View style={styles.linha}>
              <Text style={styles.nome} numberOfLines={1}>
                {item.nome}
              </Text>
              <EstoqueBadge baixo={item.estoqueBaixo} />
            </View>
            <Text style={styles.info}>
              {item.categoria} · Saldo {item.quantidade} · Mínimo {item.estoqueMinimo}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6fa' },
  lista: { padding: 16, gap: 10 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    gap: 6,
    borderWidth: 1,
    borderColor: '#eef0f3',
  },
  cardBaixo: { borderColor: '#fda29b', borderLeftWidth: 4, borderLeftColor: '#d92d20' },
  pressionado: { opacity: 0.7 },
  linha: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  nome: { flex: 1, fontSize: 16, fontWeight: '600', color: '#101828' },
  info: { color: '#667085', fontSize: 13 },
  vazio: { textAlign: 'center', color: '#667085', marginTop: 32 },
  erro: { backgroundColor: '#fee2e2', color: '#991b1b', padding: 12, margin: 16, marginBottom: 0, borderRadius: 8 },
});
