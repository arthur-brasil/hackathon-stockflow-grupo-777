import { StyleSheet, Text } from 'react-native';

// Selo vermelho para estoque baixo, verde para estoque OK
export default function EstoqueBadge({ baixo }: { baixo: boolean }) {
  return (
    <Text style={[styles.badge, baixo ? styles.baixo : styles.ok]}>
      {baixo ? 'Estoque baixo' : 'OK'}
    </Text>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: '600',
    overflow: 'hidden',
  },
  baixo: { color: '#b42318', backgroundColor: '#fee4e2' },
  ok: { color: '#166534', backgroundColor: '#dcfce7' },
});
