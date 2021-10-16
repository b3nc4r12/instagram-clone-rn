import React, { useState } from "react"
import { SafeAreaView } from "react-native"
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
                <>
                    <HomeScreen navigation={navigation} />
                    <BottomTabs icons={bottomTabIcons} component={component} setComponent={setComponent} />
                </>
            ) : component == "Search" ? (
                <>
                    <SearchScreen />
                    <BottomTabs icons={bottomTabIcons} component={component} setComponent={setComponent} />
                </>
            ) : component == "Profile" && (
                <>
                    <ProfileScreen icons={bottomTabIcons} component={component} setComponent={setComponent} />
                </>
            )}
        </SafeAreaView>
    )
}

export default MainScreen