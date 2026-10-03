import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Image, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors, radius } from '../theme';

const PICK_OPTS = { mediaTypes: ['images'], allowsEditing: true, quality: 0.3, base64: true };

export default function ItemForm({ visible, onClose, onSubmit }) {
  const [type, setType] = useState('Lost');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [contact, setContact] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');

  const reset = () => { setTitle(''); setLocation(''); setContact(''); setImage(null); setError(''); setType('Lost'); };
  const close = () => { reset(); onClose(); };

  const handle = (res) => {
    if (!res.canceled && res.assets?.[0]?.base64) setImage(`data:image/jpeg;base64,${res.assets[0].base64}`);
  };
  const pickGallery = async () => handle(await ImagePicker.launchImageLibraryAsync(PICK_OPTS));
  const pickCamera = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) return setError('Camera permission is required.');
    handle(await ImagePicker.launchCameraAsync(PICK_OPTS));
  };

  const submit = () => {
    if (!title.trim() || !location.trim()) return setError('Item name and location are required.');
    if (!/^01\d{9}$/.test(contact.trim())) return setError('Enter a valid phone number (01XXXXXXXXX).');
    onSubmit({ type, title: title.trim(), location: location.trim(), contact: contact.trim(), image });
    close();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={close}>
      <KeyboardAvoidingView style={styles.overlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.headerRow}>
            <Text style={styles.heading}>New post</Text>
            <TouchableOpacity onPress={close}><Ionicons name="close" size={24} color={colors.muted} /></TouchableOpacity>
          </View>

          <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <View style={styles.segment}>
              {['Lost', 'Found'].map((t) => (
                <TouchableOpacity key={t} style={[styles.segBtn, type === t && styles.segOn]} onPress={() => setType(t)}>
                  <Text style={[styles.segText, type === t && { color: colors.primary }]}>{t === 'Lost' ? 'I lost something' : 'I found something'}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Item name</Text>
            <TextInput style={styles.input} placeholder="e.g. Black wallet" placeholderTextColor={colors.muted} value={title} onChangeText={setTitle} />

            <Text style={styles.label}>{type === 'Lost' ? 'Where did you lose it?' : 'Where did you find it?'}</Text>
            <TextInput style={styles.input} placeholder="e.g. Library, 2nd floor" placeholderTextColor={colors.muted} value={location} onChangeText={setLocation} />

            <Text style={styles.label}>Contact number</Text>
            <TextInput style={styles.input} placeholder="01XXXXXXXXX" placeholderTextColor={colors.muted} keyboardType="phone-pad" value={contact} onChangeText={setContact} />

            <Text style={styles.label}>Photo (optional)</Text>
            {image ? (
              <View>
                <Image source={{ uri: image }} style={styles.preview} />
                <TouchableOpacity style={styles.removePhoto} onPress={() => setImage(null)}>
                  <Ionicons name="close-circle" size={26} color="#fff" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.photoRow}>
                <TouchableOpacity style={styles.photoBtn} onPress={pickGallery}>
                  <Ionicons name="image-outline" size={20} color={colors.primary} />
                  <Text style={styles.photoText}>Gallery</Text>
                </TouchableOpacity>
                {Platform.OS !== 'web' && (
                  <TouchableOpacity style={styles.photoBtn} onPress={pickCamera}>
                    <Ionicons name="camera-outline" size={20} color={colors.primary} />
                    <Text style={styles.photoText}>Camera</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {!!error && (
              <View style={styles.errorRow}>
                <Ionicons name="alert-circle-outline" size={16} color={colors.lost} />
                <Text style={styles.error}>{error}</Text>
              </View>
            )}

            <TouchableOpacity style={styles.submit} onPress={submit} activeOpacity={0.85}>
              <Text style={styles.submitText}>Publish post</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(15,23,42,0.5)' },
  sheet: { backgroundColor: '#fff', paddingHorizontal: 20, paddingBottom: 24, borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '92%' },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border, alignSelf: 'center', marginVertical: 10 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  heading: { fontSize: 20, fontWeight: '700', color: colors.text },
  segment: { flexDirection: 'row', backgroundColor: colors.bg, borderRadius: radius.md, padding: 4, marginBottom: 16, borderWidth: 1, borderColor: colors.border },
  segBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: radius.sm },
  segOn: { backgroundColor: '#fff' },
  segText: { fontSize: 14, fontWeight: '600', color: colors.muted },
  label: { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 6 },
  input: { backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: 14, height: 48, fontSize: 15, color: colors.text, marginBottom: 14 },
  photoRow: { flexDirection: 'row', marginBottom: 14 },
  photoBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 48, borderRadius: radius.md, borderWidth: 1, borderStyle: 'dashed', borderColor: colors.primary, marginRight: 8 },
  photoText: { marginLeft: 6, color: colors.primary, fontWeight: '600' },
  preview: { width: '100%', height: 170, borderRadius: radius.md, marginBottom: 14 },
  removePhoto: { position: 'absolute', top: 8, right: 8 },
  errorRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  error: { color: colors.lost, fontSize: 13, marginLeft: 6, flex: 1 },
  submit: { backgroundColor: colors.primary, height: 50, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
