import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useItems from '../hooks/useItems';
import ItemCard from '../components/ItemCard';
import ItemForm from '../components/ItemForm';
import { colors, radius, shadow } from '../theme';

const FILTERS = [
  { key: 'All', label: 'All' },
  { key: 'Lost', label: 'Lost' },
  { key: 'Found', label: 'Found' },
  { key: 'Mine', label: 'My posts' },
];

function Stat({ value, label, color }) {
  return (
    <View style={styles.stat}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function HomeScreen({ user, onLogout }) {
  const { items, loading, addItem, toggleResolved, removeItem } = useItems();
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');
  const [showForm, setShowForm] = useState(false);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((i) => {
      const okType = filter === 'All' || (filter === 'Mine' ? i.ownerId === user.id : i.type === filter);
      const okQuery = !q || i.title.toLowerCase().includes(q) || i.location.toLowerCase().includes(q);
      return okType && okQuery;
    });
  }, [items, filter, query, user.id]);

  const open = items.filter((i) => !i.resolved);
  const initials = user.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  const onAdd = (data) => addItem({ ...data, ownerId: user.id, ownerName: user.name });
  const onFab = () => (user.guest ? onLogout() : setShowForm(true));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Lost & Found</Text>
          <Text style={styles.sub}>{user.guest ? 'Browsing as guest' : `Welcome back, ${user.name.split(' ')[0]}`}</Text>
        </View>
        {user.guest ? (
          <TouchableOpacity style={styles.signIn} onPress={onLogout}>
            <Text style={styles.signInText}>Sign in</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.userBox}>
            <View style={styles.avatar}><Text style={styles.avatarText}>{initials}</Text></View>
            <TouchableOpacity onPress={onLogout} style={{ padding: 8 }} accessibilityLabel="Sign out">
              <Ionicons name="log-out-outline" size={22} color={colors.muted} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.statsCard}>
        <Stat value={open.length} label="Open" color={colors.primary} />
        <View style={styles.divider} />
        <Stat value={open.filter((i) => i.type === 'Lost').length} label="Lost" color={colors.lost} />
        <View style={styles.divider} />
        <Stat value={open.filter((i) => i.type === 'Found').length} label="Found" color={colors.found} />
      </View>

      <View style={styles.search}>
        <Ionicons name="search-outline" size={18} color={colors.muted} />
        <TextInput style={styles.searchInput} placeholder="Search by item or location" placeholderTextColor={colors.muted} value={query} onChangeText={setQuery} />
        {!!query && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Ionicons name="close-circle" size={18} color={colors.muted} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filters}>
        {FILTERS.filter((f) => !(f.key === 'Mine' && user.guest)).map((f) => (
          <TouchableOpacity key={f.key} style={[styles.chip, filter === f.key && styles.chipOn]} onPress={() => setFilter(f.key)}>
            <Text style={[styles.chipText, filter === f.key && { color: '#fff' }]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} />
      ) : (
        <FlatList
          data={shown}
          keyExtractor={(i) => i.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 110 }}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="file-tray-outline" size={48} color={colors.border} />
              <Text style={styles.emptyTitle}>No posts found</Text>
              <Text style={styles.emptyText}>Try a different filter or create a new post.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <ItemCard
              item={item}
              canEdit={!user.guest && (!item.ownerId || item.ownerId === user.id)}
              onToggle={toggleResolved}
              onDelete={removeItem}
            />
          )}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={onFab} activeOpacity={0.85} accessibilityLabel={user.guest ? 'Sign in to post' : 'New post'}>
        <Ionicons name={user.guest ? 'lock-closed-outline' : 'add'} size={28} color="#fff" />
      </TouchableOpacity>

      <ItemForm visible={showForm} onClose={() => setShowForm(false)} onSubmit={onAdd} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 8 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  title: { fontSize: 26, fontWeight: '800', color: colors.text },
  sub: { fontSize: 14, color: colors.muted, marginTop: 2 },
  userBox: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  signIn: { backgroundColor: colors.primarySoft, paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.pill },
  signInText: { color: colors.primary, fontWeight: '600' },
  statsCard: { flexDirection: 'row', backgroundColor: colors.card, borderRadius: radius.lg, paddingVertical: 14, marginBottom: 14, borderWidth: 1, borderColor: colors.border, ...shadow },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '800' },
  statLabel: { fontSize: 12, color: colors.muted, marginTop: 2 },
  divider: { width: 1, backgroundColor: colors.border },
  search: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: 12, height: 46, marginBottom: 12 },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 15, color: colors.text },
  filters: { flexDirection: 'row', marginBottom: 14 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: radius.pill, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, marginRight: 8 },
  chipOn: { backgroundColor: colors.text, borderColor: colors.text },
  chipText: { fontSize: 13, fontWeight: '600', color: colors.text },
  empty: { alignItems: 'center', marginTop: 60 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginTop: 10 },
  emptyText: { fontSize: 14, color: colors.muted, marginTop: 4 },
  fab: { position: 'absolute', right: 20, bottom: 24, width: 58, height: 58, borderRadius: 29, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', shadowColor: colors.primary, shadowOpacity: 0.35, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 6 },
});
