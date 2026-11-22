import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../services/api";

export default function LoginScreen({ navigation }) {
    const [telefone, setTelefone] = useState("");
    const [senha, setSenha] = useState("");

    const handleLogin = async () => {
    try {
        const usuario = await api.login(telefone, senha);
        await AsyncStorage.setItem("@training50_user", JSON.stringify(usuario));
        navigation.replace("MainTabs");
    } catch (err) {
        Alert.alert("Atenção", err.message);
    }
    };

    return (
    <View style={styles.container}>
      <Text style={styles.title}>Training+50</Text>
      <Text style={styles.subtitle}>Saúde, mobilidade e autonomia</Text>

      <Text style={styles.label}>Telefone (com DDD)</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 79999999999"
        keyboardType="phone-pad"
        value={telefone}
        onChangeText={setTelefone}
      />

      <Text style={styles.label}>Senha</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite sua senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Cadastro")}>
        <Text style={styles.link}>Ainda não tem conta? Cadastre-se</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#F8FAFC",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#0F172A",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#475569",
    textAlign: "center",
    marginBottom: 32,
  },
  label: { fontSize: 16, fontWeight: "600", color: "#1E293B", marginBottom: 6 },
  input: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 10,
    padding: 14,
    fontSize: 18,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#16A34A",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  link: {
    color: "#2563EB",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    fontWeight: "600",
  },
});
