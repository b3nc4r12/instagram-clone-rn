import React, { useEffect, useState } from "react"
import { Image, StyleSheet, TouchableOpacity } from "react-native"
import { View, Text } from "react-native"
import { db, firebase } from "../../firebase"
import { useNavigation } from "@react-navigation/core"

const Header = ({ bottomSheetRef }) => {
    const navigation = useNavigation();

    const [currentLoggedInUser, setCurrentLoggedInUser] = useState(null);

    const openBottomSheet = () => bottomSheetRef.current.expand()

    const getUsername = () => {
        const user = firebase.auth().currentUser
        const unsubscribe = db
            .collection("users")
            .where("owner_uid", "==", user.uid)
            .limit(1)
            .onSnapshot((snapshot) => {
                snapshot.docs.map((doc) => {
                    setCurrentLoggedInUser({
                        username: doc.data().username
                    })
                })
            })

        return unsubscribe
    }

    useEffect(() => {
        getUsername();
    }, [])

    return (
        <View style={styles.container}>
            <Text style={styles.username}>{currentLoggedInUser?.username}</Text>
            <View style={styles.iconsContainer}>
                <TouchableOpacity onPress={() => navigation.navigate("NewPostScreen")}>
                    <Image
                        source={{
                            uri: "https://img.icons8.com/fluency-systems-regular/60/ffffff/plus-2-math.png"
                        }}
                        style={styles.icon}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={openBottomSheet}>
                    <Image
                        source={{
                            uri: "https://img.icons8.com/material-outlined/24/ffffff/menu--v1.png"
                        }}
                        style={styles.icon}
                    />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    username: {
        color: "white",
        fontSize: 24,
        fontWeight: "800"
    },
    iconsContainer: {
        flexDirection: "row",
    },
    icon: {
        width: 30,
        height: 30,
        marginLeft: 20,
        resizeMode: "contain"
    },
})

export default Header
