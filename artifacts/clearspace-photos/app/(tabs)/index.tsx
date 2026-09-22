import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import React from 'react';
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { usePhotoLibrary } from '@/context/PhotoLibraryContext';

const coast = require('../../assets/images/photo-coast.png');
const table = require('../../assets/images/photo-table.png');
const meadow = require('../../assets/images/photo-meadow.png');

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { freedBytes } = usePhotoLibrary();
  const [showAll, setShowAll] = React.useState(false);
  const totalSaved = 6.8 + freedBytes / 1000000000;

  const openLibrary = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/library');
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + 18,
            paddingBottom: Platform.OS === 'web' ? 110 : 108,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={[styles.eyebrow, { color: colors.mutedForeground }]}>TUESDAY, 22 SEPT</Text>
            <Text style={[styles.wordmark, { color: colors.foreground }]}>clearspace</Text>
          </View>
          <Pressable
            accessibilityLabel="Open settings"
            testID="home-settings"
            onPress={() => router.push('/settings')}
            style={({ pressed }) => [
              styles.iconButton,
              { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Feather name="sliders" size={19} color={colors.foreground} />
          </Pressable>
        </View>

        <View style={[styles.hero, { backgroundColor: colors.foreground }]}>
          <View style={styles.heroTopline}>
            <View style={[styles.statusDot, { backgroundColor: colors.accent }]} />
            <Text style={[styles.heroKicker, { color: colors.accent }]}>YOUR SPACE IS IN GOOD SHAPE</Text>
          </View>
          <Text style={[styles.heroTitle, { color: colors.card }]}>
            Room for the photos that matter.
          </Text>
          <Text style={[styles.heroBody, { color: '#B5C0BD' }]}>
            A quieter library starts with a few good decisions.
          </Text>
          <Pressable
            testID="make-space-button"
            onPress={openLibrary}
            style={({ pressed }) => [
              styles.primaryButton,
              { backgroundColor: colors.accent, opacity: pressed ? 0.82 : 1 },
            ]}
          >
            <Text style={[styles.primaryButtonText, { color: colors.accentForeground }]}>Make space</Text>
            <Feather name="arrow-up-right" size={17} color={colors.accentForeground} />
          </Pressable>
        </View>

        <View style={styles.storageRow}>
          <View>
            <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>STORAGE USED</Text>
            <Text style={[styles.storageValue, { color: colors.foreground }]}>84.6 <Text style={styles.storageUnit}>GB</Text></Text>
          </View>
          <View style={styles.storageMeta}>
            <Text style={[styles.storagePercent, { color: colors.primary }]}>78%</Text>
            <Text style={[styles.storageCaption, { color: colors.mutedForeground }]}>of 108 GB</Text>
          </View>
        </View>
        <View style={[styles.progressTrack, { backgroundColor: colors.muted }]}>
          <View style={[styles.progressFill, { backgroundColor: colors.primary, width: '78%' }]} />
        </View>
        <Text style={[styles.savedLine, { color: colors.mutedForeground }]}>
          {totalSaved.toFixed(1)} GB found that you can clear
        </Text>

        <View style={styles.sectionHeading}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Good places to start</Text>
          <Pressable onPress={() => setShowAll((value) => !value)} testID="show-all">
            <Text style={[styles.link, { color: colors.primary }]}>{showAll ? 'Show less' : 'Show all'}</Text>
          </Pressable>
        </View>

        <View style={styles.actionList}>
          <StorageAction icon="copy" title="Duplicate photos" detail="240 items · 3.4 GB" accent={colors.primary} colors={colors} onPress={openLibrary} />
          <StorageAction icon="aperture" title="Blurry & accidental" detail="312 items · 1.8 GB" accent={colors.accent} colors={colors} onPress={openLibrary} />
          {showAll ? (
            <StorageAction icon="film" title="Large videos" detail="28 items · 6.2 GB" accent="#809B8C" colors={colors} onPress={openLibrary} />
          ) : null}
        </View>

        <View style={styles.sectionHeading}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Worth keeping</Text>
          <Feather name="arrow-up-right" size={17} color={colors.mutedForeground} />
        </View>
        <Text style={[styles.sectionSubcopy, { color: colors.mutedForeground }]}>
          A few moments from your library, picked with care.
        </Text>
        <View style={styles.memoryGrid}>
          <Image source={coast} style={[styles.memoryImage, styles.tallImage]} />
          <View style={styles.memoryColumn}>
            <Image source={table} style={[styles.memoryImage, styles.smallImage]} />
            <Image source={meadow} style={[styles.memoryImage, styles.smallImage]} />
          </View>
        </View>
        <View style={styles.footerNote}>
          <Feather name="lock" size={13} color={colors.mutedForeground} />
          <Text style={[styles.footerText, { color: colors.mutedForeground }]}>
            Your photos stay on your device.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

function StorageAction({
  icon,
  title,
  detail,
  accent,
  colors,
  onPress,
}: {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  detail: string;
  accent: string;
  colors: ReturnType<typeof useColors>;
  onPress: () => void;
}) {
  return (
    <Pressable
      testID={`storage-action-${title}`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionCard,
        { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.78 : 1 },
      ]}
    >
      <View style={[styles.actionIcon, { backgroundColor: `${accent}18` }]}>
        <Feather name={icon} size={20} color={accent} />
      </View>
      <View style={styles.actionCopy}>
        <Text style={[styles.actionTitle, { color: colors.foreground }]}>{title}</Text>
        <Text style={[styles.actionDetail, { color: colors.mutedForeground }]}>{detail}</Text>
      </View>
      <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  eyebrow: { fontSize: 10, letterSpacing: 1.5, fontFamily: 'Inter_600SemiBold', marginBottom: 4 },
  wordmark: { fontSize: 27, letterSpacing: -1.2, fontFamily: 'Inter_700Bold' },
  iconButton: { width: 42, height: 42, borderRadius: 21, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  hero: { borderRadius: 26, padding: 22, minHeight: 222, justifyContent: 'space-between', marginBottom: 24 },
  heroTopline: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  heroKicker: { fontSize: 10, letterSpacing: 1.25, fontFamily: 'Inter_700Bold' },
  heroTitle: { fontSize: 29, lineHeight: 33, letterSpacing: -1, fontFamily: 'Inter_600SemiBold', maxWidth: 290, marginTop: 22 },
  heroBody: { fontSize: 13, lineHeight: 19, fontFamily: 'Inter_400Regular', marginTop: 7, marginBottom: 18 },
  primaryButton: { alignSelf: 'flex-start', minHeight: 44, borderRadius: 22, paddingHorizontal: 17, flexDirection: 'row', alignItems: 'center', gap: 11 },
  primaryButtonText: { fontSize: 13, fontFamily: 'Inter_700Bold' },
  storageRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  sectionLabel: { fontSize: 10, letterSpacing: 1.3, fontFamily: 'Inter_600SemiBold', marginBottom: 4 },
  storageValue: { fontSize: 29, letterSpacing: -1, fontFamily: 'Inter_600SemiBold' },
  storageUnit: { fontSize: 14, letterSpacing: 0, fontFamily: 'Inter_500Medium' },
  storageMeta: { alignItems: 'flex-end', paddingBottom: 4 },
  storagePercent: { fontSize: 16, fontFamily: 'Inter_700Bold' },
  storageCaption: { fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: 2 },
  progressTrack: { height: 8, borderRadius: 4, overflow: 'hidden', marginTop: 12 },
  progressFill: { height: '100%', borderRadius: 4 },
  savedLine: { fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: 9 },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 30, marginBottom: 12 },
  sectionTitle: { fontSize: 19, letterSpacing: -0.4, fontFamily: 'Inter_600SemiBold' },
  link: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  actionList: { gap: 9 },
  actionCard: { minHeight: 74, borderWidth: 1, borderRadius: 18, paddingHorizontal: 13, flexDirection: 'row', alignItems: 'center' },
  actionIcon: { width: 43, height: 43, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  actionCopy: { flex: 1, marginLeft: 12 },
  actionTitle: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  actionDetail: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 4 },
  sectionSubcopy: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: -5, marginBottom: 14 },
  memoryGrid: { flexDirection: 'row', height: 250, gap: 8 },
  memoryColumn: { flex: 1, gap: 8 },
  memoryImage: { width: '100%', borderRadius: 18 },
  tallImage: { flex: 1.05 },
  smallImage: { flex: 1 },
  footerNote: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 20 },
  footerText: { fontSize: 11, fontFamily: 'Inter_400Regular' },
});
