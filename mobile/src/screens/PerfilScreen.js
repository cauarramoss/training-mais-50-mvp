import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { User, LogOut } from 'lucide-react-native';
import BackButton from '../components/BackButton';
import SelectField from '../components/SelectField';
import { api } from '../services/api';

export default function PerfilScreen({ navigation }) {
  const [userData, setUserData] = useState({});
  const [savedMsg, setSavedMsg] = useState(false);

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem('@training50_user').then((json) => {
        if (json) setUserData(JSON.parse(json));
      });
    }, [])
  );

  const handleSave = async () => {
    if (!userData.id) return;
    const atualizado = await api.atualizarAnamnese(userData.id, {
      ...userData,
      peso: userData.peso ? parseFloat(String(userData.peso).replace(',', '.')) : null,
      altura: userData.altura ? parseFloat(String(userData.altura).replace(',', '.')) : null,
    });
    await AsyncStorage.setItem('@training50_user', JSON.stringify(atualizado));
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2000);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('@training50_user');
    navigation.replace('Login');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <BackButton onClick={() => navigation.navigate('Início')} />

      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <User size={48} color="#9CA3AF" />
        </View>
        <Text style={styles.name}>{userData.nome || 'Visitante'}</Text>
        <Text style={styles.phone}>{userData.telefone || 'Nenhum telefone cadastrado'}</Text>
      </View>

      <Text style={styles.label}>Nome Completo</Text>
      <TextInput
        style={styles.input}
        value={userData.nome || ''}
        placeholder="Digite seu nome completo"
        placeholderTextColor="#6B7280"
        onChangeText={(v) => setUserData({ ...userData, nome: v })}
      />

      <View style={styles.row2Col}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Peso (kg)</Text>
          <TextInput
            style={styles.input}
            value={userData.peso ? String(userData.peso) : ''}
            placeholder="Ex: 75"
            placeholderTextColor="#6B7280"
            keyboardType="decimal-pad"
            onChangeText={(v) => setUserData({ ...userData, peso: v })}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Altura (m)</Text>
          <TextInput
            style={styles.input}
            value={userData.altura ? String(userData.altura) : ''}
            placeholder="Ex: 1,65"
            placeholderTextColor="#6B7280"
            keyboardType="decimal-pad"
            onChangeText={(v) => setUserData({ ...userData, altura: v })}
          />
        </View>
      </View>

      <SelectField
        label="Objetivo Principal"
        value={userData.objetivo || ''}
        options={[
          'Melhorar Mobilidade e Saúde',
          'Fortalecimento Muscular',
          'Condicionamento Físico',
          'Emagrecimento Saudável',
        ]}
        onChange={(v) => setUserData({ ...userData, objetivo: v })}
      />

      <SelectField
        label="Limitação Física (Anamnese)"
        value={userData.limitacao || ''}
        options={[
          'Não possuo limitações',
          'Dores nos joelhos',
          'Dores na coluna/lombar',
          'Dores nos ombros',
          'Hipertensão / Cardíaco',
          'Outra limitação',
        ]}
        onChange={(v) => setUserData({ ...userData, limitacao: v })}
      />

      <TouchableOpacity style={styles.neonButton} onPress={handleSave} activeOpacity={0.85}>
        <Text style={styles.neonButtonText}>
          {savedMsg ? 'Alterações Salvas!' : 'Salvar Alterações'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
        <LogOut size={20} color="#D1D5DB" />
        <Text style={styles.logoutText}>Sair da Conta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#000000', padding: 24, paddingTop: 44, paddingBottom: 40 },
  profileHeader: { alignItems: 'center', marginBottom: 24 },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#1F2937',
    borderWidth: 4,
    borderColor: '#3ee084',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  name: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center' },
  phone: { fontSize: 16, color: '#3ee084', marginTop: 2 },
  label: { fontSize: 16, fontWeight: '500', color: '#E5E7EB', marginBottom: 8, marginLeft: 4 },
  row2Col: { flexDirection: 'row', gap: 12 },
  input: {
    backgroundColor: '#111827',
    borderWidth: 2,
    borderColor: '#374151',
    borderRadius: 14,
    padding: 16,
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  neonButton: {
    backgroundColor: '#3ee084',
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  neonButtonText: { color: '#030712', fontSize: 20, fontWeight: '900' },
  logoutBtn: {
    marginTop: 16,
    backgroundColor: '#111827',
    borderWidth: 2,
    borderColor: '#374151',
    paddingVertical: 16,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  logoutText: { color: '#D1D5DB', fontSize: 18, fontWeight: 'bold' },
});