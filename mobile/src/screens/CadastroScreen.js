import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';

export default function CadastroScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [sexo, setSexo] = useState('Feminino');
  const [senha, setSenha] = useState('');

  const handleCadastro = async () => {
    if (!nome || !telefone || !senha) {
      Alert.alert('Atenção', 'Preencha nome, telefone e senha.');
      return;
    }
    try {
      const novoUsuario = await api.cadastrar({
        nome,
        telefone,
        dataNascimento: dataNascimento || '1965-01-01',
        sexo,
        senha,
      });
      await AsyncStorage.setItem('@training50_user', JSON.stringify(novoUsuario));
      navigation.replace('Anamnese');
    } catch (err) {
      Alert.alert('Erro no Cadastro', err.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Criar Conta</Text>
      <Text style={styles.subtitle}>Preencha seus dados básicos</Text>

      <Text style={styles.label}>Nome Completo</Text>
      <TextInput style={styles.input} placeholder="Ex: Maria Oliveira" value={nome} onChangeText={setNome} />

      <Text style={styles.label}>Telefone (com DDD)</Text>
      <TextInput
        style={styles.input}
        placeholder="79999999999"
        keyboardType="phone-pad"
        value={telefone}
        onChangeText={setTelefone}
      />

      <Text style={styles.label}>Data de Nascimento (AAAA-MM-DD)</Text>
      <TextInput
        style={styles.input}
        placeholder="1965-05-10"
        value={dataNascimento}
        onChangeText={setDataNascimento}
      />

      <Text style={styles.label}>Sexo</Text>
      <View style={styles.row}>
        {['Feminino', 'Masculino'].map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.chip, sexo === item && styles.chipActive]}
            onPress={() => setSexo(item)}
          >
            <Text style={[styles.chipText, sexo === item && styles.chipTextActive]}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Senha</Text>
      <TextInput style={styles.input} secureTextEntry placeholder="Crie uma senha" value={senha} onChangeText={setSenha} />

      <TouchableOpacity style={styles.button} onPress={handleCadastro}>
        <Text style={styles.buttonText}>Continuar para Anamnese</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, backgroundColor: '#F8FAFC', justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#0F172A', marginBottom: 4 },
  subtitle: { fontSize: 16, color: '#475569', marginBottom: 24 },
  label: { fontSize: 16, fontWeight: '600', color: '#1E293B', marginBottom: 6 },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    padding: 14,
    fontSize: 17,
    marginBottom: 16,
  },
  row: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  chip: { flex: 1, padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#CBD5E1', alignItems: 'center', backgroundColor: '#FFF' },
  chipActive: { backgroundColor: '#16A34A', borderColor: '#16A34A' },
  chipText: { fontSize: 16, fontWeight: '600', color: '#334155' },
  chipTextActive: { color: '#FFF' },
  button: { backgroundColor: '#16A34A', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
});