import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, METRICS, FONTS } from '../utils/constants';

export default function CustomButton({ title, onPress, variant = 'primary', icon: Icon, loading, disabled, style }) {
    const buttonStyles = [
        styles.button,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'outline' && styles.outline,
        variant === 'danger' && styles.danger,
        disabled && styles.disabled,
        style
    ];

    const textStyles = [
        styles.text,
        variant === 'primary' && styles.primaryText,
        variant === 'secondary' && styles.secondaryText,
        variant === 'outline' && styles.outlineText,
        variant === 'danger' && styles.dangerText
    ];

    return (
        <TouchableOpacity
            style={buttonStyles}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'primary' ? COLORS.white : COLORS.primary} />
            ) : (
                <>
                    {Icon && <Icon size={20} color={variant === 'primary' ? COLORS.white : COLORS.primary} style={styles.icon} />}
                    <Text style={textStyles}>{title}</Text>
                </>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
        borderRadius: METRICS.borderRadius,
        width: '100%',
    },
    primary: { backgroundColor: COLORS.primary },
    secondary: { backgroundColor: COLORS.secondary },
    outline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: COLORS.primary },
    danger: { backgroundColor: COLORS.error },
    disabled: { opacity: 0.5 },
    text: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold },
    primaryText: { color: COLORS.white },
    secondaryText: { color: COLORS.white },
    outlineText: { color: COLORS.primary },
    dangerText: { color: COLORS.white },
    icon: { marginRight: 8 },
});