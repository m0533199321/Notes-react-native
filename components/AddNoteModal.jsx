"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { Feather } from "@expo/vector-icons"

const AddNoteModal = ({ visible, onClose, onSaveNote, initialNote }) => {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [color, setColor] = useState("#F5F5F5")

  useEffect(() => {
    if (visible && initialNote) {
      setTitle(initialNote.title || "")
      setContent(initialNote.content || "")
      setColor(initialNote.color || "#F5F5F5")
    }
  }, [visible, initialNote])

  const handleSave = () => {
    if (title.trim() && content.trim()) {
      onSaveNote(title, content, color)
      resetForm()
    } else {
      // Show error
      alert("Title and content are required!")
    }
  }

  const resetForm = () => {
    setTitle("")
    setContent("")
    setColor("#F5F5F5")
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const colorOptions = [
    "#FFD3E0", // Pink
    "#FFE0B2", // Orange
    "#FFF9C4", // Yellow
    "#DCEDC8", // Light Green
    "#B3E5FC", // Light Blue
    "#D1C4E9", // Purple
    "#F5F5F5", // Gray
  ]

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={handleClose}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoid}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                  <Feather name="x" size={24} color="#333" />
                </TouchableOpacity>

                <Text style={styles.modalTitle}>{initialNote && initialNote.id ? "Edit Note" : "New Note"}</Text>

                <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.colorPickerContainer}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.colorPicker}
                >
                  {colorOptions.map((colorOption) => (
                    <TouchableOpacity
                      key={colorOption}
                      style={[
                        styles.colorOption,
                        { backgroundColor: colorOption },
                        color === colorOption && styles.selectedColorOption,
                      ]}
                      onPress={() => setColor(colorOption)}
                    />
                  ))}
                </ScrollView>
              </View>

              <View style={[styles.formContainer, { backgroundColor: color }]}>
                <TextInput
                  style={styles.titleInput}
                  placeholder="Note Title"
                  placeholderTextColor="#888"
                  value={title}
                  onChangeText={setTitle}
                  maxLength={100}
                />

                <TextInput
                  style={styles.contentInput}
                  placeholder="Start typing your note..."
                  placeholderTextColor="#888"
                  value={content}
                  onChangeText={setContent}
                  multiline
                  textAlignVertical="top"
                />
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  keyboardAvoid: {
    width: "100%",
  },
  modalContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: "80%",
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  closeButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  saveButton: {
    padding: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6200ee",
  },
  colorPickerContainer: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  colorPicker: {
    flexDirection: "row",
  },
  colorOption: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  selectedColorOption: {
    borderWidth: 2,
    borderColor: "#6200ee",
  },
  formContainer: {
    flex: 1,
    padding: 16,
  },
  titleInput: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
    padding: 8,
  },
  contentInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    padding: 8,
    minHeight: 300,
  },
})

export default AddNoteModal
