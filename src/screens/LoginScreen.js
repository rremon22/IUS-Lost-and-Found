import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadow } from '../theme';

export default function LoginScreen({ onLogin, onGuest }) {
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [error, setError] = useState('');

  const submit = () => {
    if (!name.trim()) return setError('Please enter your full name.');
    if (studentId.trim().length < 5) return setError('Please enter a valid student ID.');
    setError('');
    onLogin(name.trim(), studentId.trim());
  };

  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Ionicons name="search" size={32} color="#fff" />
      </View>
      <Text style={styles.title}>IUS Lost & Found</Text>
      <Text style={styles.subtitle}>Report and recover lost items on campus.</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Full name</Text>
        <View style={styles.field}>
          <Ionicons name="person-outline" size={18} color={colors.muted} />
          <TextInput style={styles.input} placeholder="Enter your name" placeholderTextColor={colors.muted} value={name} onChangeText={setName} />
        </View>

        <Text style={styles.label}>Student ID</Text>
        <View style={styles.field}>
          <Ionicons name="card-outline" size={18} color={colors.muted} />
          <TextInput style={styles.input} placeholder="Enter your student ID" placeholderTextColor={colors.muted} value={studentId} onChangeText={setStudentId} autoCapitalize="none" />
        </View>

        {!!error && (
          <View style={styles.errorRow}>
            <Ionicons name="alert-circle-outline" size={16} color={colors.lost} />
            <Text style={styles.error}>{error}</Text>
          </View>
        )}

        <TouchableOpacity style={styles.primaryBtn} onPress={submit} activeOpacity={0.85}>
          <Text style={styles.primaryText}>Sign in</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.guestBtn} onPress={onGuest}>
        <Text style={styles.guestText}>Continue as guest</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  logo: { width: 64, height: 64, borderRadius: radius.lg, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 16 },
  title: { fontSize: 26, fontWeight: '700', color: colors.text, textAlign: 'center' },
  subtitle: { fontSize: 14, color: colors.muted, textAlign: 'center', marginTop: 4, marginBottom: 24 },
  card: { backgroundColor: colors.card, borderRadius: radius.lg, padding: 20, ...shadow },
  label: { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 6 },
  field: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: 12, height: 48, marginBottom: 14 },
  input: { flex: 1, marginLeft: 8, fontSize: 15, color: colors.text },
  errorRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  error: { color: colors.lost, fontSize: 13, marginLeft: 6, flex: 1 },
  primaryBtn: { backgroundColor: colors.primary, height: 48, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  primaryText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  guestBtn: { alignItems: 'center', padding: 16 },
  guestText: { color: colors.primary, fontSize: 14, fontWeight: '600' },
});
