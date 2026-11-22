import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Zap, ArrowRight } from 'lucide-react-native';
import { api } from '../services/api';

export default function LoginScreen({ navigation }) {
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async () => {
    if (!telefone || !senha) {
      Alert.alert('Atenção', 'Preencha telefone e senha.');
      return;
    }
    try {
      const usuario = await api.login(telefone.trim(), senha);
      await AsyncStorage.setItem('@training50_user', JSON.stringify(usuario));
      navigation.replace('MainTabs');
    } catch (err) {
      Alert.alert('Erro no Login', err.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoCircle}>
          <Zap size={40} color="#22C55E" />
        </View>
        <Text style={styles.title}>Training +50</Text>
        <Text style={styles.subtitle}>Sua vida com mais movimento!</Text>
      </View>

      <Text style={styles.sectionHeading}>Entrar</Text>

      <Text style={styles.label}>Telefone</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite seu número de telefone"
        placeholderTextColor="#6B7280"
        keyboardType="phone-pad"
        value={telefone}
        onChangeText={setTelefone}
      />

      <Text style={styles.label}>Senha</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite sua senha"
        placeholderTextColor="#6B7280"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <TouchableOpacity style={styles.neonButton} onPress={handleLogin} activeOpacity={0.85}>
        <Text style={styles.neonButtonText}>ENTRAR</Text>
        <ArrowRight size={24} color="#030712" />
      </TouchableOpacity>

      <View style={styles.footerRow}>
        <Text style={styles.footerText}>Não possui cadastro? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
          <Text style={styles.footerLink}>Fazer cadastro</Text>
        </TouchableOpacity>
      </View>
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
  sectionHeading: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 18, marginLeft: 4 },
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
  neonButton: {
    backgroundColor: '#3ee084',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 10,
  },
  neonButtonText: { color: '#030712', fontSize: 20, fontWeight: '900', letterSpacing: 1 },
  footerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 28, flexWrap: 'wrap' },
  footerText: { color: '#D1D5DB', fontSize: 18 },
  footerLink: { color: '#4ADE80', fontSize: 18, fontWeight: 'bold', textDecorationLine: 'underline' },
});