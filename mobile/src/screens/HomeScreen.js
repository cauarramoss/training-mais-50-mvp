import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { User, Zap, PlayCircle, Sparkles } from 'lucide-react-native';
import { api } from '../services/api';

export default function HomeScreen({ navigation }) {
  const [userData, setUserData] = useState({});
  const [treinoHoje, setTreinoHoje] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [workoutReady, setWorkoutReady] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const json = await AsyncStorage.getItem('@training50_user');
        if (json) {
          const u = JSON.parse(json);
          setUserData(u);
          try {
            const treino = await api.buscarTreinoHoje(u.id);
            if (treino && treino.id) {
              setTreinoHoje(treino);
              setWorkoutReady(true);
            }
          } catch (e) {}
        }
      };
      load();
    }, [])
  );

  const handleGenerateWorkout = async () => {
    if (!userData.id) return;
    setGenerating(true);
    try {
      const novo = await api.gerarTreinoIA(userData.id);
      setTreinoHoje(novo);
      setWorkoutReady(true);
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível gerar o treino agora.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={{ flex: 1, paddingRight: 12 }}>
          <Text style={styles.welcome}>Olá, seja bem-vindo(a){userData.nome ? ',' : '!'}</Text>
          {userData.nome ? <Text style={styles.name}>{userData.nome}</Text> : null}
        </View>
        <TouchableOpacity style={styles.avatar} onPress={() => navigation.navigate('Perfil')}>
          <User size={32} color="#22C55E" />
        </TouchableOpacity>
      </View>

      {/* Destaque: Criar Treino com IA */}
      <TouchableOpacity style={styles.iaBorder} onPress={handleGenerateWorkout} disabled={generating} activeOpacity={0.85}>
        <View style={styles.iaInner}>
          {generating ? (
            <ActivityIndicator size="large" color="#22C55E" style={{ marginBottom: 12 }} />
          ) : (
            <Zap size={52} color="#22C55E" style={{ marginBottom: 12 }} />
          )}
          <Text style={styles.iaTitle}>
            {generating ? 'Personalizando seu treino...' : 'Criar Treino com IA'}
          </Text>
          <Text style={styles.iaDesc}>
            {workoutReady
              ? `Treino adaptado${userData.objetivo ? ` para "${userData.objetivo}"` : ''}${
                  userData.limitacao ? ` respeitando: ${userData.limitacao}` : ''
                }.`
              : 'Toque aqui para gerar um treino adaptado para o seu corpo hoje.'}
          </Text>
        </View>
      </TouchableOpacity>

      {workoutReady && (
        <View style={styles.readyBanner}>
          <Sparkles size={24} color="#4ADE80" />
          <Text style={styles.readyText}>
            Plano pronto
            {userData.tempoDisponivel || userData.diasSemana
              ? ` (${[userData.tempoDisponivel, userData.diasSemana].filter(Boolean).join(' • ')})`
              : ''}
            !
          </Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>Meu Treino de Hoje</Text>
      <TouchableOpacity style={styles.todayCard} onPress={() => navigation.navigate('Vídeos')} activeOpacity={0.8}>
        <View style={{ flex: 1, paddingRight: 12 }}>
          <Text style={styles.todayTitle}>
            {treinoHoje?.titulo || userData.tipoExercicio || 'Treino Personalizado'}
          </Text>
          <Text style={styles.todaySub}>
            {[userData.tempoDisponivel, userData.objetivo ? `Foco: ${userData.objetivo}` : 'Toque para iniciar']
              .filter(Boolean)
              .join(' • ')}
          </Text>
        </View>
        <PlayCircle size={44} color="#22C55E" />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#000000', padding: 24, paddingTop: 48 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 },
  welcome: { fontSize: 18, color: '#D1D5DB' },
  name: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF', marginTop: 4 },
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
  iaBorder: { backgroundColor: '#16A34A', padding: 3, borderRadius: 20, marginBottom: 24 },
  iaInner: { backgroundColor: '#090D16', borderRadius: 17, padding: 26, alignItems: 'center' },
  iaTitle: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 8, textAlign: 'center' },
  iaDesc: { fontSize: 16, color: '#D1D5DB', textAlign: 'center', lineHeight: 22 },
  readyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(20, 83, 45, 0.5)',
    borderWidth: 2,
    borderColor: 'rgba(34, 197, 94, 0.6)',
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
  },
  readyText: { color: '#BBF7D0', fontSize: 16, flex: 1 },
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
  todayTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 4 },
  todaySub: { fontSize: 15, color: '#4ADE80', fontWeight: '500' },
});