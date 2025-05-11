"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Share,
  Platform,
  KeyboardAvoidingView,
} from "react-native"
import { Feather } from "@expo/vector-icons"
import { Image } from "react-native"
import writeImage from '../assets/write.png';

const NoteDetail = ({ route, navigation }) => {
  const { note } = route.params
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(note.title)
  const [content, setContent] = useState(note.content)
  const [color, setColor] = useState(note.color || "#FFFFFF")

  useEffect(() => {
    setTitle(note.title)
    setContent(note.content)
    setColor(note.color || "#FFFFFF")
  }, [note])

  const handleSave = () => {
    if (title.trim() && content.trim()) {
      navigation.navigate("Notes", {
        updatedNote: {
          id: note.id,
          title,
          content,
          color,
        },
      })
      setIsEditing(false)
    }
  }

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${title}\n\n${content}`,
        title: title,
      })
    } catch (error) {
      console.error("Error sharing note:", error)
    }
  }

  const colorOptions = [
    "#FFD3E0",
    "#FFE0B2",
    "#FFF9C4",
    "#DCEDC8",
    "#B3E5FC",
    "#D1C4E9",
    "#F5F5F5",
  ]

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: color }]}
    >
      <View style={[styles.header, { backgroundColor: color }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (isEditing) {
              setIsEditing(false)
              setTitle(note.title)
              setContent(note.content)
              setColor(note.color || "#FFFFFF")
            } else {
              navigation.goBack()
            }
          }}
        >
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>

        <Text style={styles.headerTitle} numberOfLines={1}>
          {title}
        </Text>
        <Image
          source={writeImage}
          style={styles.headerImage}
          resizeMode="contain"
        />
      </View>

      <ScrollView style={styles.contentContainer} contentContainerStyle={styles.contentInner}>
        {isEditing ? (
          <TextInput
            style={styles.contentInput}
            value={content}
            onChangeText={setContent}
            placeholder="Note content..."
            placeholderTextColor="#888"
            multiline
            textAlignVertical="top"
            autoFocus={isEditing}
          />
        ) : (
          <>
            <Text style={styles.contentText}>{content}</Text>
            {/* <View style={styles.imageContainer}>
              <Image
                source={skyImage}
                style={styles.image}
                resizeMode="contain"
              />
            </View> */}
          </>
        )}
      </ScrollView>

      {!isEditing && (
        <View style={styles.footer}>
          <Text style={styles.dateText}>
            {note.updatedAt
              ? `Updated: ${new Date(note.updatedAt).toLocaleString()}`
              : `Created: ${new Date(note.createdAt || Date.now()).toLocaleString()}`}
          </Text>
        </View>
      )}
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop:40,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    textAlign: "left",
    color: "#333",
  },
  headerImage: {
    width: 40,
    height: 40,
    marginLeft: 8,
  },
  contentContainer: {
    flex: 1,
  },
  contentInner: {
    padding: 20,
    paddingBottom: 40,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
  contentInput: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    minHeight: 300,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  dateText: {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
  },
  imageContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
  image: {
    width: 50,
    height: 50,
  },
})

export default NoteDetail
