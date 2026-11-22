import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { User, Zap, PlayCircle } from 'lucide-react-native';
import { api } from '../services/api';

export default function HomeScreen({ navigation }) {
  const [usuario, setUsuario] = useState(null);
  const [treinoHoje, setTreinoHoje] = useState(null);
  const [loading, setLoading] = useState(false);

  const carregarDados = async () => {
    const userJson = await AsyncStorage.getItem('@training50_user');
    if (userJson) {
      const u = JSON.parse(userJson);
      setUsuario(u);
      try {
        const treino = await api.buscarTreinoHoje(u.id);
        if (treino && treino.id) setTreinoHoje(treino);
      } catch (e) {}
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [])
  );

  const handleGerarTreinoIA = async () => {
    if (!usuario) return;
    setLoading(true);
    try {
      const novo = await api.gerarTreinoIA(usuario.id);
      setTreinoHoje(novo);
      Alert.alert('Treino Gerado!', 'A IA preparou um treino seguro adaptado para o seu corpo hoje.');
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível gerar o treino.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header Saudação + Avatar */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Olá, seja bem-vindo(a),</Text>
          <Text style={styles.userName}>{usuario?.nome || 'João Silva'}</Text>
        </View>
        <TouchableOpacity style={styles.avatar} onPress={() => navigation.navigate('Perfil')}>
          <User size={32} color="#22C55E" />
        </TouchableOpacity>
      </View>

      {/* Card Destaque: Criar Treino com IA */}
      <TouchableOpacity style={styles.iaOuterCard} onPress={handleGerarTreinoIA} disabled={loading}>
        <View style={styles.iaInnerCard}>
          {loading ? (
            <ActivityIndicator size="large" color="#22C55E" style={{ marginBottom: 16 }} />
          ) : (
            <Zap size={52} color="#22C55E" style={{ marginBottom: 14 }} />
          )}
          <Text style={styles.iaTitle}>Criar Treino com IA</Text>
          <Text style={styles.iaDesc}>
            Toque aqui para gerar um treino adaptado para o seu corpo hoje.
          </Text>
        </View>
      </TouchableOpacity>

      {/* Meu Treino de Hoje */}
      <Text style={styles.sectionTitle}>Meu Treino de Hoje</Text>
      <TouchableOpacity style={styles.todayCard} onPress={() => navigation.navigate('Vídeos')}>
        <View style={{ flex: 1, paddingRight: 12 }}>
          <Text style={styles.todayTitle}>
            {treinoHoje ? treinoHoje.titulo : 'Treino Leve - Mobilidade'}
          </Text>
          <Text style={styles.todaySub}>
            {treinoHoje
              ? treinoHoje.concluido
                ? 'Concluído hoje ✅'
                : `${treinoHoje.exercicios?.length || 0} exercícios • Recomendado pela IA`
              : 'Recomendado pela IA'}
          </Text>
        </View>
        <PlayCircle size={42} color="#22C55E" />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#000000', padding: 24, paddingTop: 44 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
  welcomeText: { fontSize: 17, color: '#D1D5DB' },
  userName: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF', marginTop: 4 },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1F2937',
    borderWidth: 2,
    borderColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iaOuterCard: {
    backgroundColor: '#16A34A',
    padding: 3,
    borderRadius: 20,
    marginBottom: 32,
  },
  iaInnerCard: {
    backgroundColor: '#090D16',
    borderRadius: 17,
    padding: 28,
    alignItems: 'center',
  },
  iaTitle: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 8, textAlign: 'center' },
  iaDesc: { fontSize: 16, color: '#D1D5DB', textAlign: 'center', lineHeight: 22 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 14 },
  todayCard: {
    backgroundColor: '#111827',
    borderWidth: 2,
    borderColor: '#374151',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  todayTitle: { fontSize: 19, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 4 },
  todaySub: { fontSize: 15, color: '#4ADE80', fontWeight: '500' },
});