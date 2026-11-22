import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Play } from 'lucide-react-native';
import { api } from '../services/api';

export default function VideosScreen() {
  const [exercicios, setExercicios] = useState([]);
  const [treinoHoje, setTreinoHoje] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const userJson = await AsyncStorage.getItem('@training50_user');
        if (userJson) {
          const u = JSON.parse(userJson);
          try {
            const treino = await api.buscarTreinoHoje(u.id);
            if (treino && treino.id && treino.exercicios?.length > 0) {
              setTreinoHoje(treino);
              setExercicios(treino.exercicios);
              return;
            }
          } catch (e) {}
        }
        const lista = await api.listarExercicios();
        setExercicios(lista);
      };
      load();
    }, [])
  );

  const handleFinalizarTreino = async () => {
    if (!treinoHoje) {
      Alert.alert('Concluído!', 'Parabéns por completar os exercícios de hoje!');
      return;
    }
    const atualizado = await api.concluirTreino(treinoHoje.id);
    setTreinoHoje(atualizado);
    Alert.alert('Parabéns!', 'Treino finalizado com sucesso!');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Vídeos de Exercícios</Text>
        <Text style={styles.subtitle}>Siga os movimentos com calma</Text>
      </View>

      <View style={styles.list}>
        {exercicios.map((ex, idx) => (
          <TouchableOpacity
            key={ex.id || idx}
            style={styles.card}
            onPress={() => ex.videoUrl && Linking.openURL(ex.videoUrl)}
          >
            <View style={styles.thumb}>
              <Play size={30} color="#FFFFFF" />
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

      <TouchableOpacity style={styles.finishBtn} onPress={handleFinalizarTreino}>
        <Text style={styles.finishBtnText}>
          {treinoHoje?.concluido ? 'Treino Concluído ✅' : 'Finalizar Treino'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#000000', padding: 24, paddingTop: 44, paddingBottom: 40 },
  header: { marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 6 },
  subtitle: { fontSize: 18, color: '#22C55E', fontWeight: '500' },
  list: { gap: 16 },
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
    width: 76,
    height: 76,
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
    marginTop: 32,
    backgroundColor: 'rgba(22, 163, 74, 0.2)',
    borderWidth: 2,
    borderColor: '#22C55E',
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
  },
  finishBtnText: { color: '#4ADE80', fontSize: 20, fontWeight: 'bold' },
});