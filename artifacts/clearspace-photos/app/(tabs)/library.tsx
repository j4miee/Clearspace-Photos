import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import React, { useMemo, useState } from 'react';
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

type PhotoItem = { id: string; title: string; size: string; image: number; reason: string };
const photos: PhotoItem[] = [
  { id: 'coast-1', title: 'Coast, 14:32', size: '24.6 MB', image: coast, reason: 'Near-identical' },
  { id: 'coast-2', title: 'Coast, 14:31', size: '24.1 MB', image: coast, reason: 'Near-identical' },
  { id: 'table-1', title: 'At home, 09:18', size: '18.2 MB', image: table, reason: 'Near-identical' },
  { id: 'meadow-1', title: 'Meadow, Sunday', size: '22.8 MB', image: meadow, reason: 'Near-identical' },
];

const filters = ['Duplicates', 'Screenshots', 'Blurry', 'Videos'];

export default function LibraryScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ filter?: string }>();
  const [activeFilter, setActiveFilter] = useState(
    typeof params.filter === 'string' ? params.filter : 'Duplicates',
  );
  const { selectedIds, removeSelected } = usePhotoLibrary();
  const [removedMessage, setRemovedMessage] = useState(false);

  const visiblePhotos = useMemo(() => photos, []);
  const remove = async () => {
    if (!selectedIds.length) return;
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await removeSelected();
    setRemovedMessage(true);
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 17, paddingBottom: Platform.OS === 'web' ? 112 : 110 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Pressable
            testID="library-back"
            accessibilityLabel="Back to home"
            onPress={() => router.push('/')}
            style={({ pressed }) => [styles.backButton, { borderColor: colors.border, backgroundColor: colors.card, opacity: pressed ? 0.7 : 1 }]}
          >
            <Feather name="arrow-left" size={18} color={colors.foreground} />
          </Pressable>
          <View style={styles.headerCopy}>
            <Text style={[styles.eyebrow, { color: colors.mutedForeground }]}>LIBRARY REVIEW</Text>
            <Text style={[styles.title, { color: colors.foreground }]}>Make some room</Text>
          </View>
          <View style={{ width: 42 }} />
        </View>

        <Text style={[styles.intro, { color: colors.mutedForeground }]}>
          Keep the best version. Clear the rest in a few taps.
        </Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {filters.map((filter) => {
            const active = activeFilter === filter;
            return (
              <Pressable
                key={filter}
                testID={`filter-${filter}`}
                onPress={() => setActiveFilter(filter)}
                style={({ pressed }) => [
                  styles.filterPill,
                  { backgroundColor: active ? colors.foreground : colors.card, borderColor: active ? colors.foreground : colors.border, opacity: pressed ? 0.72 : 1 },
                ]}
              >
                <Text style={[styles.filterText, { color: active ? colors.card : colors.mutedForeground }]}>{filter}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {removedMessage ? (
          <View style={[styles.successBanner, { backgroundColor: colors.secondary }]}>
            <Feather name="check-circle" size={17} color={colors.primary} />
            <Text style={[styles.successText, { color: colors.secondaryForeground }]}>Nice. Those photos are out of your way.</Text>
            <Pressable onPress={() => setRemovedMessage(false)}><Feather name="x" size={16} color={colors.mutedForeground} /></Pressable>
          </View>
        ) : null}

        <View style={styles.reviewHeading}>
          <View>
            <Text style={[styles.reviewTitle, { color: colors.foreground }]}>{activeFilter}</Text>
            <Text style={[styles.reviewCaption, { color: colors.mutedForeground }]}>4 items · 89.7 MB to review</Text>
          </View>
          <View style={[styles.aiTag, { backgroundColor: `${colors.accent}30` }]}>
            <Feather name="aperture" size={13} color={colors.accentForeground} />
            <Text style={[styles.aiTagText, { color: colors.accentForeground }]}>Smart pick</Text>
          </View>
        </View>

        <View style={styles.photoGrid}>
          {visiblePhotos.map((photo) => (
            <PhotoCard key={photo.id} photo={photo} selected={selectedIds.includes(photo.id)} colors={colors} />
          ))}
        </View>

        <View style={[styles.keepNote, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="check" size={15} color={colors.primary} />
          <Text style={[styles.keepNoteText, { color: colors.mutedForeground }]}>
            The clearest photo in each group stays automatically.
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { backgroundColor: colors.card, borderColor: colors.border, paddingBottom: Platform.OS === 'web' ? 20 : insets.bottom + 10 }]}>
        <Text style={[styles.selectionText, { color: colors.foreground }]}>
          {selectedIds.length ? `${selectedIds.length} selected` : 'Tap photos to select'}
        </Text>
        <Pressable
          testID="remove-selected"
          disabled={!selectedIds.length}
          onPress={remove}
          style={({ pressed }) => [
            styles.removeButton,
            { backgroundColor: selectedIds.length ? colors.primary : colors.muted, opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <Feather name="trash-2" size={16} color={selectedIds.length ? colors.primaryForeground : colors.mutedForeground} />
          <Text style={[styles.removeText, { color: selectedIds.length ? colors.primaryForeground : colors.mutedForeground }]}>Remove</Text>
        </Pressable>
      </View>
    </View>
  );
}

function PhotoCard({
  photo,
  selected,
  colors,
}: {
  photo: PhotoItem;
  selected: boolean;
  colors: ReturnType<typeof useColors>;
}) {
  const { toggleSelection } = usePhotoLibrary();
  return (
    <Pressable
      testID={`photo-${photo.id}`}
      onPress={() => {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        toggleSelection(photo.id);
      }}
      style={({ pressed }) => [styles.photoCard, { backgroundColor: colors.card, borderColor: selected ? colors.primary : colors.border, borderWidth: selected ? 2 : 1, opacity: pressed ? 0.86 : 1 }]}
    >
      <View style={styles.photoFrame}>
        <Image source={photo.image} style={styles.photoImage} />
        <View style={[styles.photoCheck, { backgroundColor: selected ? colors.primary : `${colors.card}D9`, borderColor: selected ? colors.primary : colors.card }]}>
          {selected ? <Feather name="check" size={13} color={colors.primaryForeground} /> : null}
        </View>
        <View style={[styles.reasonTag, { backgroundColor: `${colors.foreground}CC` }]}>
          <Text style={[styles.reasonText, { color: colors.card }]}>{photo.reason}</Text>
        </View>
      </View>
      <View style={styles.photoMeta}>
        <Text style={[styles.photoTitle, { color: colors.foreground }]} numberOfLines={1}>{photo.title}</Text>
        <Text style={[styles.photoSize, { color: colors.mutedForeground }]}>{photo.size}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 20 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backButton: { width: 42, height: 42, borderRadius: 21, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  headerCopy: { alignItems: 'center' },
  eyebrow: { fontSize: 10, letterSpacing: 1.4, fontFamily: 'Inter_600SemiBold', marginBottom: 4 },
  title: { fontSize: 23, letterSpacing: -0.7, fontFamily: 'Inter_600SemiBold' },
  intro: { fontSize: 13, lineHeight: 19, fontFamily: 'Inter_400Regular', textAlign: 'center', marginTop: 18, paddingHorizontal: 20 },
  filterRow: { gap: 8, paddingVertical: 24 },
  filterPill: { borderWidth: 1, paddingHorizontal: 15, height: 35, borderRadius: 18, justifyContent: 'center' },
  filterText: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  successBanner: { flexDirection: 'row', gap: 9, alignItems: 'center', borderRadius: 14, padding: 13, marginBottom: 18 },
  successText: { flex: 1, fontSize: 12, fontFamily: 'Inter_500Medium' },
  reviewHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  reviewTitle: { fontSize: 19, fontFamily: 'Inter_600SemiBold', letterSpacing: -0.4 },
  reviewCaption: { fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: 4 },
  aiTag: { flexDirection: 'row', gap: 5, alignItems: 'center', paddingHorizontal: 9, paddingVertical: 7, borderRadius: 12 },
  aiTagText: { fontSize: 10, fontFamily: 'Inter_700Bold' },
  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  photoCard: { width: '48.3%', borderRadius: 17, overflow: 'hidden' },
  photoFrame: { height: 177, position: 'relative' },
  photoImage: { width: '100%', height: '100%' },
  photoCheck: { position: 'absolute', top: 10, right: 10, width: 25, height: 25, borderRadius: 13, borderWidth: 2, justifyContent: 'center', alignItems: 'center' },
  reasonTag: { position: 'absolute', left: 9, bottom: 9, borderRadius: 8, paddingHorizontal: 7, paddingVertical: 4 },
  reasonText: { fontSize: 9, fontFamily: 'Inter_600SemiBold' },
  photoMeta: { paddingHorizontal: 10, paddingVertical: 10 },
  photoTitle: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  photoSize: { fontSize: 10, fontFamily: 'Inter_400Regular', marginTop: 3 },
  keepNote: { marginTop: 20, borderWidth: 1, borderRadius: 14, padding: 13, flexDirection: 'row', alignItems: 'center', gap: 8 },
  keepNoteText: { fontSize: 11, fontFamily: 'Inter_400Regular', flex: 1 },
  bottomBar: { position: 'absolute', left: 0, right: 0, bottom: 0, borderTopWidth: 1, paddingHorizontal: 20, paddingTop: 13, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  selectionText: { fontSize: 12, fontFamily: 'Inter_500Medium' },
  removeButton: { minHeight: 43, paddingHorizontal: 15, borderRadius: 22, flexDirection: 'row', alignItems: 'center', gap: 8 },
  removeText: { fontSize: 12, fontFamily: 'Inter_700Bold' },
});