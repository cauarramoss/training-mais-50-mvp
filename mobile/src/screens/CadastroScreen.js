import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Zap, ArrowRight } from 'lucide-react-native';
import { api } from '../services/api';

export default function CadastroScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');

  const handleCadastro = async () => {
    if (!nome || !telefone || !senha) {
      Alert.alert('Atenção', 'Preencha todos os campos para continuar.');
      return;
    }
    const anoNasc = idade ? 2026 - parseInt(idade, 10) : 1965;
    try {
      const novoUsuario = await api.cadastrar({
        nome,
        telefone,
        dataNascimento: `${anoNasc}-01-01`,
        sexo: 'Não informado',
        senha,
      });
      await AsyncStorage.setItem('@training50_user', JSON.stringify(novoUsuario));
      navigation.replace('Anamnese');
    } catch (err) {
      Alert.alert('Erro', err.message);
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

      <Text style={styles.label}>Nome Completo</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: João Silva"
        placeholderTextColor="#6B7280"
        value={nome}
        onChangeText={setNome}
      />

      <Text style={styles.label}>Idade</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 55"
        placeholderTextColor="#6B7280"
        keyboardType="numeric"
        value={idade}
        onChangeText={setIdade}
      />

      <Text style={styles.label}>Telefone (para login)</Text>
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

      <TouchableOpacity style={styles.primaryButton} onPress={handleCadastro}>
        <Text style={styles.primaryButtonText}>Continuar para Anamnese</Text>
        <ArrowRight size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryLink} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.secondaryLinkText}>Já possui conta? Entrar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#000000', padding: 24, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 28 },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(22, 163, 74, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  title: { fontSize: 34, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 4 },
  subtitle: { fontSize: 18, color: '#D1D5DB' },
  label: { fontSize: 16, fontWeight: '500', color: '#E5E7EB', marginBottom: 6, marginLeft: 4 },
  input: {
    backgroundColor: '#111827',
    borderWidth: 2,
    borderColor: '#374151',
    borderRadius: 14,
    padding: 18,
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: '#16A34A',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 12,
  },
  primaryButtonText: { color: '#FFFFFF', fontSize: 19, fontWeight: 'bold' },
  secondaryLink: { marginTop: 20, alignItems: 'center' },
  secondaryLinkText: { color: '#9CA3AF', fontSize: 16 },
});