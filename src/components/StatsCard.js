import { View, Text, StyleSheet } from 'react-native';
import { COLORS, METRICS, FONTS } from '../utils/constants';

export default function StatCard({ icon: Icon, value, label, color = COLORS.primary }) {
  return (
    <View style={styles.card}>
      {Icon && <Icon size={24} color={color} />}
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: METRICS.borderRadius,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  value: { fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.bold, color: COLORS.text, marginTop: 8 },
  label: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, marginTop: 4 },
});