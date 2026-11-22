import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import { ChevronDown, Check } from 'lucide-react-native';

export default function SelectField({ label, value, placeholder = 'Selecione', options, onChange }) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={{ marginBottom: 16 }}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity style={styles.selector} onPress={() => setVisible(true)} activeOpacity={0.8}>
        <Text style={[styles.selectorText, !value && { color: '#6B7280' }]}>
          {value || placeholder}
        </Text>
        <ChevronDown size={22} color="#9CA3AF" />
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setVisible(false)}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>{label || placeholder}</Text>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => {
                const selected = value === item;
                return (
                  <TouchableOpacity
                    style={[styles.optionItem, selected && styles.optionItemActive]}
                    onPress={() => {
                      onChange(item);
                      setVisible(false);
                    }}
                  >
                    <Text style={[styles.optionText, selected && styles.optionTextActive]}>{item}</Text>
                    {selected && <Check size={20} color="#3ee084" />}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 16, fontWeight: '500', color: '#E5E7EB', marginBottom: 8, marginLeft: 4 },
  selector: {
    backgroundColor: '#111827',
    borderWidth: 2,
    borderColor: '#374151',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectorText: { fontSize: 18, color: '#FFFFFF', flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 24 },
  modalBox: {
    backgroundColor: '#111827',
    borderWidth: 2,
    borderColor: '#374151',
    borderRadius: 20,
    padding: 20,
    maxHeight: '70%',
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 16 },
  optionItem: {
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  optionItemActive: { backgroundColor: 'rgba(62, 224, 132, 0.15)' },
  optionText: { fontSize: 18, color: '#D1D5DB' },
  optionTextActive: { color: '#3ee084', fontWeight: 'bold' },
});