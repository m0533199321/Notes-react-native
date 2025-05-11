"use client"

import { useEffect } from "react"
import { View, Text, StyleSheet, Image, ActivityIndicator } from "react-native"

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    // Navigate to Notes screen after 2 seconds
    const timer = setTimeout(() => {
      navigation.replace("Notes")
    }, 2000)

    return () => clearTimeout(timer)
  }, [navigation])

  return (
    <View style={styles.container}>
      <Image source={require("./assets/write.png")} style={styles.logo} />
      <Text style={styles.title}>Stylish Notes</Text>
      <Text style={styles.subtitle}>Capture your thoughts in style</Text>
      <ActivityIndicator size="large" color="#6200ee" style={styles.loader} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
    marginBottom: 40,
  },
  loader: {
    marginTop: 20,
  },
})

export default SplashScreen
