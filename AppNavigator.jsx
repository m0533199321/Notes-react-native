import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import NoteList from "./components/NoteList"
import NoteDetail from "./components/NoteDetail"

const Stack = createNativeStackNavigator()

const AppNavigator = ({ notes, onDeleteNote, onUpdateNote, onAddNote }) => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Notes"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#f8f8f8" },
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="Notes">
          {(props) => (
            <NoteList
              {...props}
              notes={notes}
              onDeleteNote={onDeleteNote}
              onUpdateNote={onUpdateNote}
              onAddNote={onAddNote}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="NoteDetail" component={NoteDetail} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigator
