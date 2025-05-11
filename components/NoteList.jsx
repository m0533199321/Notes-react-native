"use client"

import { useState, useRef } from "react"
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Animated,
  Platform,
  Alert,
} from "react-native"
import { Feather } from "@expo/vector-icons"
import AddNoteModal from "./AddNoteModal"

const { width } = Dimensions.get("window")

const NoteList = ({ notes, onDeleteNote, onUpdateNote, onAddNote, navigation }) => {
  const [modalVisible, setModalVisible] = useState(false)
  const [currentNote, setCurrentNote] = useState({})
  const [searchQuery, setSearchQuery] = useState("")

  const scrollY = useRef(new Animated.Value(0)).current
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [120, 70],
    extrapolate: "clamp",
  })

  // Filter notes based on search query
  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAddNote = () => {
    setCurrentNote({ title: "", content: "", color: getRandomColor() })
    setModalVisible(true)
  }

  const handleEditNote = (note) => {
    setCurrentNote(note)
    setModalVisible(true)
  }

  const handleSaveNote = (title, content, color) => {
    if (currentNote.id) {
      onUpdateNote(currentNote.id, { title, content, color })
    } else {
      onAddNote({ title, content, color })
    }
    setModalVisible(false)
  }

  const handleDeleteNote = (id) => {
    Alert.alert("Delete Note", "Are you sure you want to delete this note?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => onDeleteNote(id),
        style: "destructive",
      },
    ])
  }

  const getRandomColor = () => {
    const colors = [
      "#FFD3E0", // Pink
      "#FFE0B2", // Orange
      "#FFF9C4", // Yellow
      "#DCEDC8", // Light Green
      "#B3E5FC", // Light Blue
      "#D1C4E9", // Purple
      "#F5F5F5", // Gray
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  const renderHeader = () => (
    <Animated.View style={[styles.header, { height: headerHeight }]}>
      <View style={styles.headerTop}>
        <Text style={styles.headerTitle}>My Notes</Text>
      </View>
      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search notes..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Feather name="x" size={20} color="#888" />
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  )

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Feather name="file-text" size={80} color="#ccc" />
      <Text style={styles.emptyText}>No notes yet</Text>
      <Text style={styles.emptySubText}>Tap the + button to create your first note</Text>
    </View>
  )

  return (
    <View style={styles.container}>
      {renderHeader()}

      <FlatList
        data={filteredNotes}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={[styles.listContent, filteredNotes.length === 0 && styles.emptyList]}
        ListEmptyComponent={renderEmptyList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.noteCard, { backgroundColor: item.color || "#F5F5F5" }]}
            onPress={() => navigation.navigate("NoteDetail", { note: item })}
            activeOpacity={0.7}
          >
            <Text style={styles.noteTitle} numberOfLines={1} ellipsizeMode="tail">
              {item.title}
            </Text>
            <Text style={styles.noteContent} numberOfLines={5} ellipsizeMode="tail">
              {item.content}
            </Text>
            <View style={styles.noteActions}>
              <TouchableOpacity style={styles.actionButton} onPress={() => handleEditNote(item)}>
                <Feather name="edit-2" size={18} color="#555" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={() => handleDeleteNote(item.id)}>
                <Feather name="trash-2" size={18} color="#555" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAddNote}>
        <Feather name="plus" size={24} color="#fff" />
      </TouchableOpacity>

      <AddNoteModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSaveNote={handleSaveNote}
        initialNote={currentNote}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  header: {
    paddingTop: Platform.OS === "ios" ? 0 : 10,
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: "#fff",
    justifyContent: "space-between",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    zIndex: 10,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 46,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    height: 46,
  },
  listContent: {
    padding: 8,
    paddingTop: 16,
    paddingBottom: 100,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noteCard: {
    flex: 1,
    margin: 8,
    borderRadius: 12,
    padding: 16,
    minHeight: 150,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  noteContent: {
    fontSize: 14,
    color: "#555",
    flex: 1,
    width: width / 2 - 40, // Half screen width minus padding
  },
  noteActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.7)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  addButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#6200ee",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#555",
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubText: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
  },
})

export default NoteList
