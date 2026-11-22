import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ArrowRight } from 'lucide-react-native';
import BackButton from '../components/BackButton';
import SelectField from '../components/SelectField';
import { api } from '../services/api';

export default function CadastroScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [sexo, setSexo] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erro, setErro] = useState('');

  const handleCriarConta = async () => {
    if (!nome || !telefone || !senha) {
      setErro('Preencha nome, telefone e senha.');
      return;
    }
    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem. Verifique novamente.');
      return;
    }
    setErro('');
    try {
      const novoUsuario = await api.cadastrar({
        nome: nome.trim(),
        telefone: telefone.trim(),
        dataNascimento: dataNascimento || '1965-01-01',
        sexo: sexo || 'Não informado',
        senha,
      });
      await AsyncStorage.setItem('@training50_user', JSON.stringify(novoUsuario));
      navigation.replace('Anamnese');
    } catch (err) {
      setErro(err.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <BackButton onClick={() => navigation.goBack()} />

      <View style={styles.header}>
        <Text style={styles.title}>Training +50</Text>
        <Text style={styles.subtitle}>Crie sua conta</Text>
      </View>

      <Text style={styles.sectionHeading}>Cadastro:</Text>

      {erro ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{erro}</Text>
        </View>
      ) : null}

      <Text style={styles.label}>Nome completo</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite seu nome completo"
        placeholderTextColor="#6B7280"
        value={nome}
        onChangeText={setNome}
      />

      <Text style={styles.label}>Telefone</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite seu telefone"
        placeholderTextColor="#6B7280"
        keyboardType="phone-pad"
        value={telefone}
        onChangeText={setTelefone}
      />

      <Text style={styles.label}>Data de nascimento (AAAA-MM-DD)</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 1965-05-15"
        placeholderTextColor="#6B7280"
        value={dataNascimento}
        onChangeText={setDataNascimento}
      />

      <SelectField
        label="Sexo"
        value={sexo}
        options={['Feminino', 'Masculino', 'Outro/Prefiro não dizer']}
        onChange={setSexo}
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

      <Text style={styles.label}>Confirmar senha</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite a senha novamente"
        placeholderTextColor="#6B7280"
        secureTextEntry
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
      />

      <TouchableOpacity style={styles.neonButton} onPress={handleCriarConta} activeOpacity={0.85}>
        <Text style={styles.neonButtonText}>Continuar para Anamnese</Text>
        <ArrowRight size={24} color="#030712" />
      </TouchableOpacity>

      <View style={styles.footerRow}>
        <Text style={styles.footerText}>Já possui conta? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.footerLink}>Voltar para o login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#000000', padding: 24, paddingTop: 44, paddingBottom: 32 },
  header: { alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 30, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 4 },
  subtitle: { fontSize: 18, color: '#3ee084', fontWeight: '500' },
  sectionHeading: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 16, marginLeft: 4 },
  errorBox: {
    backgroundColor: 'rgba(69, 10, 10, 0.85)',
    borderWidth: 2,
    borderColor: '#EF4444',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  errorText: { color: '#FECACA', fontSize: 16, fontWeight: '500' },
  label: { fontSize: 16, fontWeight: '500', color: '#E5E7EB', marginBottom: 8, marginLeft: 4 },
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
    paddingHorizontal: 20,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 12,
  },
  neonButtonText: { color: '#030712', fontSize: 19, fontWeight: '900' },
  footerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 22 },
  footerText: { color: '#D1D5DB', fontSize: 16 },
  footerLink: { color: '#4ADE80', fontSize: 16, fontWeight: 'bold', textDecorationLine: 'underline' },
});