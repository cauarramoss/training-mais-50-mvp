import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';

export default function BackButton({ onPress }) {
  return (
    <TouchableOpacity style={styles.btn} onPress={onPress} activeOpacity={0.8}>
      <ArrowLeft size={24} color="#3ee084" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    alignSelf: 'flex-start',
    backgroundColor: '#111827',
    borderWidth: 2,
    borderColor: '#374151',
    padding: 14,
    borderRadius: 14,
    marginBottom: 16,
  },
});