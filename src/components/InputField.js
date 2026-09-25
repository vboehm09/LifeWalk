import { View, Text, TextInput, StyleSheet } from 'react-native';
import { COLORS, METRICS, FONTS } from '../utils/constants';

export default function InputField({ label, value, onChangeText, placeholder, keyboardType = 'default', error }) {
    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TextInput
                style={[styles.input, error && styles.inputError]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={COLORS.textLight}
                keyboardType={keyboardType}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { marginBottom: 16 },
    label: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.semibold, color: COLORS.text, marginBottom: 6 },
    input: {
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: METRICS.borderRadius,
        padding: 14,
        fontSize: FONTS.sizes.md,
        color: COLORS.text,
    },
    inputError: { borderColor: COLORS.error },
    errorText: { color: COLORS.error, fontSize: FONTS.sizes.xs, marginTop: 4 },
});