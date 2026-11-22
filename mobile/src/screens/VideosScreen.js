import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Play, CheckCircle2 } from 'lucide-react-native';
import BackButton from '../components/BackButton';
import { api } from '../services/api';

export default function VideosScreen({ navigation }) {
  const [userData, setUserData] = useState({});
  const [exercises, setExercises] = useState([]);
  const [treinoHoje, setTreinoHoje] = useState(null);
  const [completed, setCompleted] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const json = await AsyncStorage.getItem('@training50_user');
        if (json) {
          const u = JSON.parse(json);
          setUserData(u);
          try {
            const treino = await api.buscarTreinoHoje(u.id);
            if (treino && treino.id && treino.exercicios?.length > 0) {
              setTreinoHoje(treino);
              setExercises(treino.exercicios);
              return;
            }
          } catch (e) {}
        }
        const catalogo = await api.listarExercicios();
        setExercises(catalogo);
      };
      load();
    }, [])
  );

  const handleFinish = async () => {
    setCompleted(true);
    if (treinoHoje?.id) {
      await api.concluirTreino(treinoHoje.id);
    }
    setTimeout(() => {
      setCompleted(false);
      navigation.navigate('Início');
    }, 1200);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <BackButton onClick={() => navigation.navigate('Início')} />

      <View style={styles.header}>
        <Text style={styles.title}>Vídeos de Exercícios</Text>
        <Text style={styles.subtitle}>
          {userData.limitacao ? `Adaptado: ${userData.limitacao}` : 'Siga os movimentos com calma'}
        </Text>
      </View>

      <View style={styles.list}>
        {exercises.map((ex, idx) => (
          <TouchableOpacity
            key={ex.id || idx}
            style={styles.card}
            onPress={() => ex.videoUrl && Linking.openURL(ex.videoUrl)}
            activeOpacity={0.8}
          >
            <View style={styles.thumb}>
              <Play size={28} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.exName}>{ex.nome}</Text>
              <Text style={styles.exMeta}>
                {ex.series} • {ex.categoria}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.finishBtn} onPress={handleFinish} activeOpacity={0.85}>
        {completed ? (
          <>
            <CheckCircle2 size={24} color="#4ADE80" />
            <Text style={styles.finishBtnText}>Treino Concluído!</Text>
          </>
        ) : (
          <Text style={styles.finishBtnText}>Finalizar Treino</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#000000', padding: 24, paddingTop: 44, paddingBottom: 40 },
  header: { marginBottom: 22 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 6 },
  subtitle: { fontSize: 18, color: '#3ee084', fontWeight: '500' },
  list: { gap: 14 },
  card: {
    backgroundColor: '#111827',
    borderWidth: 2,
    borderColor: '#374151',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#1F2937',
    borderWidth: 1,
    borderColor: '#4B5563',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exName: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' },
  exMeta: { fontSize: 15, color: '#D1D5DB', marginTop: 4 },
  finishBtn: {
    marginTop: 28,
    backgroundColor: 'rgba(22, 163, 74, 0.2)',
    borderWidth: 2,
    borderColor: '#22C55E',
    paddingVertical: 18,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  finishBtnText: { color: '#4ADE80', fontSize: 20, fontWeight: 'bold' },
});