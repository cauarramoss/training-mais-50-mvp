import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { User } from 'lucide-react-native';
import { api } from '../services/api';

export default function PerfilScreen({ navigation }) {
  const [usuario, setUsuario] = useState(null);
  const [nome, setNome] = useState('');
  const [limitacao, setLimitacao] = useState('nenhuma');

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem('@training50_user').then((u) => {
        if (u) {
          const parsed = JSON.parse(u);
          setUsuario(parsed);
          setNome(parsed.nome || '');
          setLimitacao(parsed.limitacao || 'nenhuma');
        }
      });
    }, [])
  );

  const handleSalvar = async () => {
    if (!usuario) return;
    try {
      const atualizado = await api.atualizarAnamnese(usuario.id, {
        ...usuario,
        nome,
        limitacao,
      });
      await AsyncStorage.setItem('@training50_user', JSON.stringify(atualizado));
      Alert.alert('Sucesso', 'Alterações salvas!');
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível atualizar o perfil.');
    }
  };

  const handleSair = async () => {
    await AsyncStorage.removeItem('@training50_user');
    navigation.replace('Cadastro');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <User size={52} color="#6B7280" />
        </View>
        <Text style={styles.name}>{nome || 'João Silva'}</Text>
        <Text style={styles.role}>Usuário Training+50</Text>
      </View>

      <Text style={styles.label}>Nome</Text>
      <TextInput style={styles.input} value={nome} onChangeText={setNome} />

      <Text style={styles.label}>Dores Articulares (Anamnese)</Text>
      <View style={styles.optionsGroup}>
        {[
          { label: 'Não possuo dores', value: 'nenhuma' },
          { label: 'Sim, nos joelhos', value: 'joelho' },
          { label: 'Sim, na coluna/lombar', value: 'lombar' },
        ].map((item) => {
          const active = limitacao === item.value;
          return (
            <TouchableOpacity
              key={item.value}
              style={[styles.optionBtn, active && styles.optionBtnActive]}
              onPress={() => setLimitacao(item.value)}
            >
              <Text style={[styles.optionText, active && styles.optionTextActive]}>{item.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={handleSalvar}>
        <Text style={styles.primaryButtonText}>Salvar Alterações</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleSair}>
        <Text style={styles.logoutText}>Sair da Conta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#000000', padding: 24, paddingTop: 44, paddingBottom: 40 },
  profileHeader: { alignItems: 'center', marginBottom: 28 },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#1F2937',
    borderWidth: 4,
    borderColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  name: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF' },
  role: { fontSize: 17, color: '#22C55E', marginTop: 2 },
  label: { fontSize: 16, fontWeight: '500', color: '#E5E7EB', marginBottom: 8, marginLeft: 4 },
  input: {
    backgroundColor: '#111827',
    borderWidth: 2,
    borderColor: '#374151',
    borderRadius: 14,
    padding: 18,
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 18,
  },
  optionsGroup: { gap: 10, marginBottom: 20 },
  optionBtn: {
    backgroundColor: '#111827',
    borderWidth: 2,
    borderColor: '#374151',
    borderRadius: 14,
    padding: 16,
  },
  optionBtnActive: { backgroundColor: 'rgba(22, 163, 74, 0.2)', borderColor: '#22C55E' },
  optionText: { fontSize: 16, color: '#D1D5DB' },
  optionTextActive: { color: '#4ADE80', fontWeight: 'bold' },
  primaryButton: {
    backgroundColor: '#16A34A',
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryButtonText: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
  logoutBtn: { marginTop: 18, alignItems: 'center', padding: 12 },
  logoutText: { color: '#EF4444', fontSize: 16, fontWeight: '600' },
});