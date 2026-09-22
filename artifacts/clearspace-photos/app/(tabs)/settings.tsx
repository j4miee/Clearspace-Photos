import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { usePhotoLibrary } from '@/context/PhotoLibraryContext';

export default function SettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { freedBytes } = usePhotoLibrary();
  const [askBeforeDelete, setAskBeforeDelete] = useState(true);
  const [smartSuggestions, setSmartSuggestions] = useState(true);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 18, paddingBottom: Platform.OS === 'web' ? 110 : 105 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Pressable onPress={() => router.push('/')} style={({ pressed }) => [styles.iconButton, { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.7 : 1 }]}>
            <Feather name="arrow-left" size={18} color={colors.foreground} />
          </Pressable>
          <Text style={[styles.title, { color: colors.foreground }]}>Settings</Text>
          <View style={{ width: 42 }} />
        </View>

        <View style={[styles.profileCard, { backgroundColor: colors.foreground }]}>
          <View style={[styles.profileMark, { backgroundColor: colors.accent }]}>
            <Feather name="sun" size={19} color={colors.accentForeground} />
          </View>
          <View style={styles.profileCopy}>
            <Text style={[styles.profileTitle, { color: colors.card }]}>Private by default</Text>
            <Text style={[styles.profileBody, { color: '#B5C0BD' }]}>Clearspace works on your device.</Text>
          </View>
          <Feather name="check" size={18} color={colors.accent} />
        </View>

        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>REVIEW PREFERENCES</Text>
        <View style={[styles.settingGroup, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SettingRow
            icon="shield"
            title="Ask before deleting"
            detail="Keep a final moment to change your mind"
            value={askBeforeDelete}
            onValueChange={setAskBeforeDelete}
            colors={colors}
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <SettingRow
            icon="aperture"
            title="Smart suggestions"
            detail="Use clarity, duplicates and size to sort"
            value={smartSuggestions}
            onValueChange={setSmartSuggestions}
            colors={colors}
          />
        </View>

        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>YOUR PROGRESS</Text>
        <View style={[styles.progressCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.progressIcon, { backgroundColor: `${colors.primary}16` }]}>
            <Feather name="archive" size={19} color={colors.primary} />
          </View>
          <View style={styles.progressCopy}>
            <Text style={[styles.progressTitle, { color: colors.foreground }]}>{freedBytes ? `${Math.max(1, Math.round(freedBytes / 1000000))} MB` : '0 MB'} cleared</Text>
            <Text style={[styles.progressBody, { color: colors.mutedForeground }]}>Every good decision adds up.</Text>
          </View>
          <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
        </View>

        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>ABOUT</Text>
        <View style={[styles.aboutCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.aboutTitle, { color: colors.foreground }]}>Clearspace</Text>
          <Text style={[styles.aboutBody, { color: colors.mutedForeground }]}>Make space for what’s worth keeping.</Text>
          <Text style={[styles.version, { color: colors.mutedForeground }]}>Version 1.0 · Made with care</Text>
        </View>
      </ScrollView>
    </View>
  );
}

function SettingRow({
  icon,
  title,
  detail,
  value,
  onValueChange,
  colors,
}: {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  detail: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={styles.settingRow}>
      <View style={[styles.settingIcon, { backgroundColor: colors.secondary }]}>
        <Feather name={icon} size={17} color={colors.secondaryForeground} />
      </View>
      <View style={styles.settingCopy}>
        <Text style={[styles.settingTitle, { color: colors.foreground }]}>{title}</Text>
        <Text style={[styles.settingDetail, { color: colors.mutedForeground }]}>{detail}</Text>
      </View>
      <Switch value={value} onValueChange={onValueChange} trackColor={{ false: colors.muted, true: colors.primary }} thumbColor={colors.card} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 20 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 26 },
  iconButton: { width: 42, height: 42, borderRadius: 21, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 23, letterSpacing: -0.7, fontFamily: 'Inter_600SemiBold' },
  profileCard: { minHeight: 100, borderRadius: 21, padding: 17, flexDirection: 'row', alignItems: 'center', marginBottom: 28 },
  profileMark: { width: 43, height: 43, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  profileCopy: { flex: 1, marginLeft: 12 },
  profileTitle: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  profileBody: { fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: 4 },
  sectionLabel: { fontSize: 10, letterSpacing: 1.4, fontFamily: 'Inter_600SemiBold', marginBottom: 10, marginTop: 2 },
  settingGroup: { borderWidth: 1, borderRadius: 18, overflow: 'hidden', marginBottom: 27 },
  settingRow: { minHeight: 78, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 13 },
  settingIcon: { width: 37, height: 37, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  settingCopy: { flex: 1, marginLeft: 11, paddingRight: 8 },
  settingTitle: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  settingDetail: { fontSize: 10, fontFamily: 'Inter_400Regular', marginTop: 4 },
  divider: { height: 1, marginLeft: 61 },
  progressCard: { minHeight: 78, borderWidth: 1, borderRadius: 18, paddingHorizontal: 13, flexDirection: 'row', alignItems: 'center', marginBottom: 27 },
  progressIcon: { width: 37, height: 37, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  progressCopy: { flex: 1, marginLeft: 11 },
  progressTitle: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  progressBody: { fontSize: 10, fontFamily: 'Inter_400Regular', marginTop: 4 },
  aboutCard: { borderWidth: 1, borderRadius: 18, padding: 16 },
  aboutTitle: { fontSize: 17, fontFamily: 'Inter_600SemiBold' },
  aboutBody: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 5 },
  version: { fontSize: 10, fontFamily: 'Inter_400Regular', marginTop: 18 },
});