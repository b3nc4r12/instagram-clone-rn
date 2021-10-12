import React, { useState } from "react"
import { View, Text, SafeAreaView } from "react-native"
import HomeScreen from "./HomeScreen"
import BottomTabs from "../components/home/BottomTabs"
import { bottomTabIcons } from "../data/bottomTabIcons"
import SearchScreen from "./SearchScreen"
import ProfileScreen from "./ProfileScreen"

const MainScreen = ({ navigation }) => {
    const [component, setComponent] = useState("Home");

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
            {component == "Home" ? (
                <HomeScreen navigation={navigation} />
            ) : component == "Search" ? (
                <SearchScreen />
            ) : component == "Profile" && (
                <ProfileScreen />
            )}
            <BottomTabs icons={bottomTabIcons} component={component} setComponent={setComponent} />
        </SafeAreaView>
    )
}

export default MainScreen