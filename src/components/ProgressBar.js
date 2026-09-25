import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../utils/constants';

export default function ProgressRing({ progress = 0, size = 220, thickness = 12, children }) {
    const safeProgress = Math.min(Math.max(progress, 0), 100);
    const color = safeProgress >= 100 ? COLORS.secondary : COLORS.primary;

    return (
        <View style={[styles.container, { width: size, height: size, borderRadius: size / 2, borderWidth: thickness, borderColor: COLORS.border }]}>
            <View style={[StyleSheet.absoluteFillObject, { borderRadius: size / 2, borderWidth: thickness, borderColor: color, opacity: safeProgress > 0 ? 1 : 0 }]} />

            <View style={styles.content}>
                {children || (
                    <>
                        <Text style={styles.progressText}>{Math.floor(safeProgress)}%</Text>
                    </>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.surface },
    content: { alignItems: 'center', justifyContent: 'center' },
    progressText: { fontSize: FONTS.sizes.xxxl, fontWeight: FONTS.weights.bold, color: COLORS.text },
});