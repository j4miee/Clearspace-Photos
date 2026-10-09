import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { usePhotoLibrary } from '@/context/PhotoLibraryContext';

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const {
    scannedPhotoCount,
    similarGroupCount,
    pendingRemovalIds,
    freedBytes,
    clearedPhotoCount,
  } = usePhotoLibrary();

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 15, paddingBottom: Platform.OS === 'web' ? 115 : 110 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.brand}>
            <View style={[styles.brandMark, { backgroundColor: colors.foreground }]}>
              <Feather name="aperture" size={17} color={colors.card} />
            </View>
            <Text style={[styles.brandName, { color: colors.foreground }]}>clearspace</Text>
          </View>
          <Pressable
            testID="open-settings"
            accessibilityLabel="Open settings"
            onPress={() => router.push('/settings')}
            style={({ pressed }) => [
              styles.settingsButton,
              { borderColor: colors.border, backgroundColor: colors.card, opacity: pressed ? 0.72 : 1 },
            ]}
          >
            <Feather name="sliders" size={17} color={colors.foreground} />
          </Pressable>
        </View>

        <View style={styles.hero}>
          <View style={[styles.privacyPill, { backgroundColor: colors.secondary }]}>
            <View style={[styles.privacyDot, { backgroundColor: colors.primary }]} />
            <Text style={[styles.privacyText, { color: colors.secondaryForeground }]}>PRIVATE BY DEFAULT</Text>
          </View>
          <Text style={[styles.headline, { color: colors.foreground }]}>
            Keep the moments.{'\n'}Clear the rest.
          </Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            A calmer camera roll starts with one good choice.
          </Text>
        </View>

        <Pressable
          testID="start-photo-review"
          onPress={() => router.push('/library')}
          style={({ pressed }) => [
            styles.reviewCard,
            { backgroundColor: colors.foreground, transform: [{ scale: pressed ? 0.99 : 1 }] },
          ]}
        >
          <View style={styles.reviewCardTop}>
            <View style={[styles.reviewIcon, { backgroundColor: colors.accent }]}>
              <Feather name="copy" size={18} color={colors.accentForeground} />
            </View>
            <Feather name="arrow-up-right" size={18} color={colors.accent} />
          </View>
          <Text style={[styles.reviewTitle, { color: colors.card }]}>Similar moments</Text>
          <Text style={[styles.reviewDetail, { color: colors.muted }]}>
            {scannedPhotoCount > 0
              ? `${similarGroupCount} sets found in ${scannedPhotoCount} scanned photos`
              : 'Find quick bursts and choose the version worth keeping'}
          </Text>
          <View style={styles.reviewCardBottom}>
            <Text style={[styles.reviewAction, { color: colors.accent }]}>
              {scannedPhotoCount > 0 ? 'Continue review' : 'Scan on this device'}
            </Text>
            <Feather name="arrow-right" size={15} color={colors.accent} />
          </View>
        </Pressable>

        <View style={styles.sectionHeading}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Your library</Text>
          <Text style={[styles.sectionNote, { color: colors.mutedForeground }]}>LOCAL ONLY</Text>
        </View>
        <View style={[styles.libraryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.libraryIcon, { backgroundColor: colors.secondary }]}>
            <Feather name="shield" size={17} color={colors.secondaryForeground} />
          </View>
          <View style={styles.libraryCopy}>
            <Text style={[styles.libraryTitle, { color: colors.foreground }]}>Nothing leaves your phone</Text>
            <Text style={[styles.libraryDetail, { color: colors.mutedForeground }]}>
              Suggestions use capture time, photo dimensions, favourites and local file size — not visual AI.
            </Text>
          </View>
          <Feather name="check" size={16} color={colors.primary} />
        </View>

        {pendingRemovalIds.length > 0 ? (
          <Pressable
            testID="open-removal-review"
            onPress={() => router.push('/library')}
            style={[styles.queueCard, { backgroundColor: `${colors.destructive}10`, borderColor: `${colors.destructive}32` }]}
          >
            <Feather name="trash-2" size={17} color={colors.destructive} />
            <View style={styles.queueCopy}>
              <Text style={[styles.queueTitle, { color: colors.foreground }]}>
                {pendingRemovalIds.length} {pendingRemovalIds.length === 1 ? 'photo' : 'photos'} marked for removal
              </Text>
              <Text style={[styles.queueDetail, { color: colors.mutedForeground }]}>
                Still in your library until you confirm
              </Text>
            </View>
            <Feather name="chevron-right" size={17} color={colors.mutedForeground} />
          </Pressable>
        ) : null}

        {clearedPhotoCount > 0 ? (
          <View style={[styles.clearedCard, { borderColor: colors.border }]}>
            <View style={[styles.clearedIcon, { backgroundColor: colors.secondary }]}>
              <Feather name="archive" size={15} color={colors.secondaryForeground} />
            </View>
            <View style={styles.libraryCopy}>
              <Text style={[styles.clearedTitle, { color: colors.foreground }]}>
                {clearedPhotoCount} {clearedPhotoCount === 1 ? 'photo' : 'photos'} removed
              </Text>
              <Text style={[styles.clearedDetail, { color: colors.mutedForeground }]}>
                {freedBytes > 0 ? `About ${(freedBytes / 1_000_000).toFixed(1)} MB of local files` : 'Removed from your photo library'}
              </Text>
            </View>
          </View>
        ) : null}

        <View style={styles.footer}>
          <Feather name="lock" size={12} color={colors.mutedForeground} />
          <Text style={[styles.footerText, { color: colors.mutedForeground }]}>
            Review every choice before anything is deleted.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 21 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  brandMark: { width: 31, height: 31, borderRadius: 11, justifyContent: 'center', alignItems: 'center' },
  brandName: { fontSize: 17, letterSpacing: -0.7, fontFamily: 'Inter_600SemiBold' },
  settingsButton: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  hero: { marginTop: 32, marginBottom: 23 },
  privacyPill: { flexDirection: 'row', alignItems: 'center', gap: 7, alignSelf: 'flex-start', borderRadius: 13, paddingHorizontal: 10, paddingVertical: 7 },
  privacyDot: { width: 6, height: 6, borderRadius: 3 },
  privacyText: { fontSize: 9, letterSpacing: 1.2, fontFamily: 'Inter_700Bold' },
  headline: { fontSize: 36, lineHeight: 41, letterSpacing: -1.7, fontFamily: 'Inter_600SemiBold', marginTop: 16 },
  subtitle: { fontSize: 13, lineHeight: 20, fontFamily: 'Inter_400Regular', marginTop: 9 },
  reviewCard: { borderRadius: 22, padding: 18, minHeight: 196 },
  reviewCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  reviewIcon: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  reviewTitle: { fontSize: 19, letterSpacing: -0.5, fontFamily: 'Inter_600SemiBold', marginTop: 16 },
  reviewDetail: { fontSize: 11, lineHeight: 16, fontFamily: 'Inter_400Regular', marginTop: 5, maxWidth: 245 },
  reviewCardBottom: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 17 },
  reviewAction: { fontSize: 11, fontFamily: 'Inter_700Bold' },
  sectionHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 29, marginBottom: 11 },
  sectionTitle: { fontSize: 16, letterSpacing: -0.3, fontFamily: 'Inter_600SemiBold' },
  sectionNote: { fontSize: 9, letterSpacing: 1.1, fontFamily: 'Inter_600SemiBold' },
  libraryCard: { borderWidth: 1, borderRadius: 18, minHeight: 77, padding: 13, flexDirection: 'row', alignItems: 'center', gap: 11 },
  libraryIcon: { width: 37, height: 37, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  libraryCopy: { flex: 1 },
  libraryTitle: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  libraryDetail: { fontSize: 10, lineHeight: 14, fontFamily: 'Inter_400Regular', marginTop: 4 },
  queueCard: { borderWidth: 1, borderRadius: 16, padding: 13, flexDirection: 'row', alignItems: 'center', gap: 11, marginTop: 13 },
  queueCopy: { flex: 1 },
  queueTitle: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  queueDetail: { fontSize: 10, fontFamily: 'Inter_400Regular', marginTop: 4 },
  clearedCard: { borderTopWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 10, paddingTop: 16, marginTop: 17 },
  clearedIcon: { width: 32, height: 32, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  clearedTitle: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  clearedDetail: { fontSize: 10, fontFamily: 'Inter_400Regular', marginTop: 3 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 23 },
  footerText: { fontSize: 10, fontFamily: 'Inter_400Regular' },
});
