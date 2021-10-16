import React from "react"
import { LogBox, Platform } from "react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import AuthNavigation from "./AuthNavigation"

const App = () => {
  if (Platform.OS != "web") {
    LogBox.ignoreLogs(["Can't perform a React state update"])
  }

  return (
    <SafeAreaProvider>
      <AuthNavigation />
    </SafeAreaProvider>
  )
}

export default App