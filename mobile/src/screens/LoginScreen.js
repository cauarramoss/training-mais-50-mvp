import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Zap, ArrowRight } from 'lucide-react-native';
import { api } from '../services/api';

export default function LoginScreen({ navigation }) {
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async () => {
    try {
      const usuario = await api.login(telefone, senha);
      await AsyncStorage.setItem('@training50_user', JSON.stringify(usuario));
      navigation.replace('MainTabs');
    } catch (err) {
      Alert.alert('Atenção', err.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoCircle}>
          <Zap size={40} color="#22C55E" />
        </View>
        <Text style={styles.title}>Training+50</Text>
        <Text style={styles.subtitle}>Saúde e força em qualquer idade</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Telefone (com DDD)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 79999999999"
          placeholderTextColor="#6B7280"
          keyboardType="phone-pad"
          value={telefone}
          onChangeText={setTelefone}
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          placeholderTextColor="#6B7280"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
        <Text style={styles.primaryButtonText}>Entrar</Text>
        <ArrowRight size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryLink} onPress={() => navigation.navigate('Cadastro')}>
        <Text style={styles.secondaryLinkText}>Não tem conta? Cadastre-se</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#000000', padding: 24, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 32 },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(22, 163, 74, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: { fontSize: 36, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 6 },
  subtitle: { fontSize: 18, color: '#D1D5DB', textAlign: 'center' },
  form: { gap: 16 },
  label: { fontSize: 16, fontWeight: '500', color: '#E5E7EB', marginBottom: 6, marginLeft: 4 },
  input: {
    backgroundColor: '#111827',
    borderWidth: 2,
    borderColor: '#374151',
    borderRadius: 14,
    padding: 18,
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: '#16A34A',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 16,
  },
  primaryButtonText: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
  secondaryLink: { marginTop: 24, alignItems: 'center' },
  secondaryLinkText: { color: '#4ADE80', fontSize: 17, fontWeight: '600' },
});