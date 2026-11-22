import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Check } from 'lucide-react-native';
import BackButton from '../components/BackButton';
import SelectField from '../components/SelectField';
import { api } from '../services/api';

export default function AnamneseScreen({ navigation }) {
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [nivelExperiencia, setNivelExperiencia] = useState('');
  const [diasSemana, setDiasSemana] = useState('');
  const [tempoDisponivel, setTempoDisponivel] = useState('');
  const [tipoExercicio, setTipoExercicio] = useState('');
  const [limitacao, setLimitacao] = useState('');
  const [observacao, setObservacao] = useState('');

  const handleContinuar = async () => {
    try {
      const userJson = await AsyncStorage.getItem('@training50_user');
      const user = JSON.parse(userJson);

      const atualizado = await api.atualizarAnamnese(user.id, {
        ...user,
        peso: peso ? parseFloat(peso.replace(',', '.')) : null,
        altura: altura ? parseFloat(altura.replace(',', '.')) : null,
        objetivo: objetivo || 'Melhorar Mobilidade e Saúde',
        nivelExperiencia: nivelExperiencia || 'Sedentário / Iniciante',
        diasSemana: diasSemana || '3 dias por semana',
        tempoDisponivel: tempoDisponivel || '20 a 30 minutos',
        tipoExercicio: tipoExercicio || 'Alongamento e Mobilidade',
        limitacao: limitacao || 'Não possuo limitações',
        observacao,
      });

      await AsyncStorage.setItem('@training50_user', JSON.stringify(atualizado));
      navigation.replace('MainTabs');
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível salvar os dados da anamnese.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <BackButton onClick={() => navigation.goBack()} />

      <View style={styles.header}>
        <Text style={styles.tag}>TRAINING +50</Text>
        <Text style={styles.title}>Conte-nos um pouco sobre você</Text>
        <Text style={styles.subtitle}>
          Essas informações serão utilizadas para ajudar na personalização do seu treino.
        </Text>
      </View>

      <View style={styles.row2Col}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Peso (kg)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 75"
            placeholderTextColor="#6B7280"
            keyboardType="decimal-pad"
            value={peso}
            onChangeText={setPeso}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Altura (m)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 1,65"
            placeholderTextColor="#6B7280"
            keyboardType="decimal-pad"
            value={altura}
            onChangeText={setAltura}
          />
        </View>
      </View>

      <SelectField
        label="Qual seu objetivo?"
        placeholder="Selecione seu objetivo"
        value={objetivo}
        options={[
          'Melhorar Mobilidade e Saúde',
          'Fortalecimento Muscular',
          'Condicionamento Físico',
          'Emagrecimento Saudável',
        ]}
        onChange={setObjetivo}
      />

      <SelectField
        label="Qual seu nível de experiência?"
        placeholder="Selecione seu nível"
        value={nivelExperiencia}
        options={[
          'Sedentário / Iniciante',
          'Pratico atividades leves',
          'Intermediário / Ativo',
        ]}
        onChange={setNivelExperiencia}
      />

      <SelectField
        label="Quantos dias por semana pretende treinar?"
        value={diasSemana}
        options={[
          '2 dias por semana',
          '3 dias por semana',
          '4 dias por semana',
          '5 ou mais dias por semana',
        ]}
        onChange={setDiasSemana}
      />

      <SelectField
        label="Quanto tempo você tem disponível por treino?"
        value={tempoDisponivel}
        options={['20 a 30 minutos', '30 a 45 minutos', '45 a 60 minutos']}
        onChange={setTempoDisponivel}
      />

      <SelectField
        label="Que tipo de exercício você prefere?"
        value={tipoExercicio}
        options={[
          'Alongamento e Mobilidade',
          'Caminhada / Aeróbico Leve',
          'Fortalecimento com Peso do Corpo',
          'Musculação / Pesos Leves',
        ]}
        onChange={setTipoExercicio}
      />

      <SelectField
        label="Você possui alguma limitação física ou restrição para realizar exercícios?"
        value={limitacao}
        options={[
          'Não possuo limitações',
          'Dores nos joelhos',
          'Dores na coluna/lombar',
          'Dores nos ombros',
          'Hipertensão / Cardíaco',
          'Outra limitação',
        ]}
        onChange={setLimitacao}
      />

      <Text style={styles.label}>Gostaria de descrever alguma outra observação?</Text>
      <TextInput
        style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
        multiline
        placeholder="Ex: Tenho artrose leve no joelho direito..."
        placeholderTextColor="#6B7280"
        value={observacao}
        onChangeText={setObservacao}
      />

      <TouchableOpacity style={styles.neonButton} onPress={handleContinuar} activeOpacity={0.85}>
        <Text style={styles.neonButtonText}>Finalizar Cadastro</Text>
        <Check size={24} color="#030712" />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#000000', padding: 24, paddingTop: 44, paddingBottom: 40 },
  header: { marginBottom: 24 },
  tag: { color: '#3ee084', fontWeight: 'bold', fontSize: 14, letterSpacing: 1 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF', marginTop: 4, marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#D1D5DB', lineHeight: 23 },
  row2Col: { flexDirection: 'row', gap: 12 },
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
    paddingHorizontal: 24,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 12,
  },
  neonButtonText: { color: '#030712', fontSize: 20, fontWeight: '900' },
});