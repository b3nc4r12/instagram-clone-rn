import React from "react"
import { KeyboardAvoidingView, LogBox, Platform } from "react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import AuthNavigation from "./AuthNavigation"

const App = () => {
  if (Platform.OS != "web") {
    LogBox.ignoreLogs(["Can't perform a React state update"])
  }

  return (
    <SafeAreaProvider>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <AuthNavigation />
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  )
}

export default App