import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Check } from 'lucide-react-native';
import { api } from '../services/api';

export default function AnamneseScreen({ navigation }) {
  const [limitacao, setLimitacao] = useState('nenhuma');
  const [objetivo, setObjetivo] = useState('Melhorar Mobilidade e Saúde');
  const [nivel, setNivel] = useState('Sedentário / Iniciante');

  const doresOptions = [
    { label: 'Não possuo dores', value: 'nenhuma' },
    { label: 'Sim, nos joelhos', value: 'joelho' },
    { label: 'Sim, na coluna/lombar', value: 'lombar' },
    { label: 'Sim, nos ombros', value: 'ombro' },
  ];

  const objetivosOptions = [
    'Melhorar Mobilidade e Saúde',
    'Fortalecimento Muscular',
    'Condicionamento Físico',
  ];

  const handleFinalizar = async () => {
    try {
      const userJson = await AsyncStorage.getItem('@training50_user');
      const user = JSON.parse(userJson);

      const atualizado = await api.atualizarAnamnese(user.id, {
        objetivo,
        nivelExperiencia: nivel,
        diasSemana: '3 dias',
        tempoDisponivel: '30 minutos',
        tipoExercicio: 'Funcional Leve',
        limitacao,
      });

      await AsyncStorage.setItem('@training50_user', JSON.stringify(atualizado));
      navigation.replace('MainTabs');
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível salvar os dados.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Conhecendo você</Text>
        <Text style={styles.subtitle}>Responda para a IA montar um treino seguro e eficiente para você.</Text>
      </View>

      <Text style={styles.label}>Possui dores articulares?</Text>
      <View style={styles.optionsGroup}>
        {doresOptions.map((item) => {
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

      <Text style={styles.label}>Qual seu principal objetivo?</Text>
      <View style={styles.optionsGroup}>
        {objetivosOptions.map((item) => {
          const active = objetivo === item;
          return (
            <TouchableOpacity
              key={item}
              style={[styles.optionBtn, active && styles.optionBtnActive]}
              onPress={() => setObjetivo(item)}
            >
              <Text style={[styles.optionText, active && styles.optionTextActive]}>{item}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.label}>Nível de Atividade</Text>
      <View style={styles.optionsGroup}>
        {['Sedentário / Iniciante', 'Pratico atividades leves'].map((item) => {
          const active = nivel === item;
          return (
            <TouchableOpacity
              key={item}
              style={[styles.optionBtn, active && styles.optionBtnActive]}
              onPress={() => setNivel(item)}
            >
              <Text style={[styles.optionText, active && styles.optionTextActive]}>{item}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={handleFinalizar}>
        <Text style={styles.primaryButtonText}>Finalizar Cadastro</Text>
        <Check size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#000000', padding: 24, paddingTop: 48 },
  header: { marginBottom: 24 },
  title: { fontSize: 30, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 8 },
  subtitle: { fontSize: 17, color: '#D1D5DB', lineHeight: 24 },
  label: { fontSize: 18, fontWeight: '600', color: '#E5E7EB', marginTop: 16, marginBottom: 10 },
  optionsGroup: { gap: 10 },
  optionBtn: {
    backgroundColor: '#111827',
    borderWidth: 2,
    borderColor: '#374151',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  optionBtnActive: {
    backgroundColor: 'rgba(22, 163, 74, 0.2)',
    borderColor: '#22C55E',
  },
  optionText: { fontSize: 17, fontWeight: '500', color: '#D1D5DB' },
  optionTextActive: { color: '#4ADE80', fontWeight: 'bold' },
  primaryButton: {
    backgroundColor: '#16A34A',
    paddingVertical: 18,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 28,
    marginBottom: 24,
  },
  primaryButtonText: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
});