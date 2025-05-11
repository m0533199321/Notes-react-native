"use client"

import { useState, useEffect } from "react"
import {
  SafeAreaView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ImageBackground,
  ActivityIndicator,
} from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import AppNavigator from "./AppNavigator"
import { SafeAreaProvider } from "react-native-safe-area-context"
import * as SplashScreen from "expo-splash-screen"

// Keep splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync()

const App = () => {
  const [notes, setNotes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [appIsReady, setAppIsReady] = useState(false)

  // Load notes from AsyncStorage
  useEffect(() => {
    async function prepare() {
      try {
        // Load notes
        const storedNotes = await AsyncStorage.getItem("notes")
        if (storedNotes) {
          setNotes(JSON.parse(storedNotes))
        }

        // Artificial delay for splash screen
        await new Promise((resolve) => setTimeout(resolve, 2000))
      } catch (e) {
        console.warn("Error loading data:", e)
      } finally {
        setIsLoading(false)
        setAppIsReady(true)
      }
    }

    prepare()
  }, [])

  // Hide splash screen when ready
  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync()
    }
  }, [appIsReady])

  const saveNotes = async (notesToSave) => {
    try {
      await AsyncStorage.setItem("notes", JSON.stringify(notesToSave))
    } catch (error) {
      console.error("Failed to save notes", error)
    }
  }

  const handleAddNote = (newNote) => {
    const updatedNotes = [
      ...notes,
      {
        id: Date.now().toString(),
        ...newNote,
        createdAt: new Date().toISOString(),
      },
    ]
    setNotes(updatedNotes)
    saveNotes(updatedNotes)
  }

  const handleUpdateNote = (id, updatedNote) => {
    const updatedNotes = notes.map((note) =>
      note.id === id
        ? {
            ...note,
            ...updatedNote,
            updatedAt: new Date().toISOString(),
          }
        : note,
    )
    setNotes(updatedNotes)
    saveNotes(updatedNotes)
  }

  const handleDeleteNote = (id) => {
    const updatedNotes = notes.filter((note) => note.id !== id)
    setNotes(updatedNotes)
    saveNotes(updatedNotes)
  }

  if (isLoading) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={[styles.container, styles.loadingContainer]}>
          <ActivityIndicator size="large" color="#6200ee" />
        </SafeAreaView>
      </SafeAreaProvider>
    )
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#f8f8f8" />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <ImageBackground
            source={require("./assets/notepad.png")}
            style={styles.backgroundImage}
            imageStyle={{ opacity: 0.05 }}
          >
            <AppNavigator
              notes={notes}
              onDeleteNote={handleDeleteNote}
              onUpdateNote={handleUpdateNote}
              onAddNote={handleAddNote}
            />
          </ImageBackground>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
})

export default App
