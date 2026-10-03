import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, Platform, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadow } from '../theme';

const confirmDelete = (onYes) => {
  if (Platform.OS === 'web') {
    if (window.confirm('Delete this post?')) onYes();
  } else {
    Alert.alert('Delete post', 'This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: onYes },
    ]);
  }
};

const timeAgo = (ts) => {
  const m = Math.floor((Date.now() - ts) / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} h ago`;
  return `${Math.floor(h / 24)} d ago`;
};

function Row({ icon, text }) {
  return (
    <View style={styles.row}>
      <Ionicons name={icon} size={15} color={colors.muted} />
      <Text style={styles.rowText}>{text}</Text>
    </View>
  );
}

export default function ItemCard({ item, canEdit, onToggle, onDelete }) {
  const isLost = item.type === 'Lost';
  return (
    <View style={styles.card}>
      {!!item.image && <Image source={{ uri: item.image }} style={styles.photo} resizeMode="cover" />}
      <View style={styles.body}>
        <View style={styles.topRow}>
          <View style={[styles.badge, { backgroundColor: isLost ? colors.lostSoft : colors.foundSoft }]}>
            <Text style={[styles.badgeText, { color: isLost ? colors.lost : colors.found }]}>{item.type.toUpperCase()}</Text>
          </View>
          {item.resolved && (
            <View style={[styles.badge, { backgroundColor: colors.primarySoft, marginLeft: 6 }]}>
              <Text style={[styles.badgeText, { color: colors.primary }]}>RESOLVED</Text>
            </View>
          )}
          <Text style={styles.time}>{timeAgo(item.createdAt)}</Text>
        </View>

        <Text style={[styles.title, item.resolved && styles.done]}>{item.title}</Text>
        <Row icon="location-outline" text={item.location} />
        <Row icon="call-outline" text={item.contact} />
        {!!item.ownerName && <Row icon="person-outline" text={`Posted by ${item.ownerName}`} />}

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => Linking.openURL(`tel:${item.contact}`)}>
            <Ionicons name="call" size={16} color={colors.primary} />
            <Text style={styles.actionText}>Call</Text>
          </TouchableOpacity>
          {canEdit && (
            <>
              <TouchableOpacity style={styles.actionBtn} onPress={() => onToggle(item.id)}>
                <Ionicons name={item.resolved ? 'refresh' : 'checkmark-circle-outline'} size={16} color={colors.primary} />
                <Text style={styles.actionText}>{item.resolved ? 'Reopen' : 'Mark resolved'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn]} onPress={() => confirmDelete(() => onDelete(item.id))}>
                <Ionicons name="trash-outline" size={16} color={colors.lost} />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.card, borderRadius: radius.lg, marginBottom: 14, overflow: 'hidden', borderWidth: 1, borderColor: colors.border, ...shadow },
  photo: { width: '100%', height: 170, backgroundColor: colors.border },
  body: { padding: 14 },
  topRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.pill },
  badgeText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  time: { marginLeft: 'auto', fontSize: 12, color: colors.muted },
  title: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 8 },
  done: { textDecorationLine: 'line-through', color: colors.muted },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  rowText: { marginLeft: 6, fontSize: 14, color: colors.muted, flex: 1 },
  actions: { flexDirection: 'row', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border },
  actionBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, height: 36, borderRadius: radius.sm, backgroundColor: colors.primarySoft, marginRight: 8 },
  actionText: { marginLeft: 6, fontSize: 13, fontWeight: '600', color: colors.primary },
  deleteBtn: { backgroundColor: colors.lostSoft, marginLeft: 'auto', marginRight: 0 },
});
