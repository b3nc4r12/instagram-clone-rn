import React, { useEffect, useState } from "react"
import { View, Text, ScrollView, Image, StyleSheet } from "react-native"
import { Divider } from "react-native-elements"
import { users } from "../../data/users"
import { firebase, db } from "../../firebase"

const Stories = () => {
    const [currentLoggedInUser, setCurrentLoggedInUser] = useState(null);

    const getUsername = () => {
        const user = firebase.auth().currentUser
        const unsubscribe = db
            .collection("users")
            .where("owner_uid", "==", user.uid)
            .limit(1)
            .onSnapshot((snapshot) => {
                snapshot.docs.map((doc) => {
                    setCurrentLoggedInUser({
                        username: doc.data().username,
                        profilePicture: doc.data().profile_picture,
                    })
                })
            })

        return unsubscribe
    }

    useEffect(() => {
        getUsername();
    }, [])

    return (
        <View style={{ marginBottom: 13 }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={{ alignItems: "center", marginLeft: 18, position: "relative" }}>
                    <Image
                        source={{ uri: currentLoggedInUser?.profilePicture }}
                        style={[styles.story, { borderWidth: 0 }]}
                    />
                    <Text style={{ color: "white" }}>
                        {currentLoggedInUser?.username.length > 10 ? currentLoggedInUser?.username.slice(0, 7).toLowerCase() + "..." : currentLoggedInUser?.username}
                    </Text>
                    <View style={{ backgroundColor: "#0095f6", padding: 4, borderRadius: 25, position: "absolute", bottom: 16, right: -2, borderWidth: 4 }}>
                        <Image
                            source={{ uri: "https://img.icons8.com/ios-glyphs/30/ffffff/plus-math.png" }}
                            style={{ width: 14, height: 14, resizeMode: "contain" }}
                        />
                    </View>
                </View>
                {users.map((story, index) => (
                    <View key={index} style={[{ alignItems: "center", marginLeft: 18 }, index == 3 ? { marginRight: 18 } : null]}>
                        <Image
                            source={{ uri: story.image }}
                            style={styles.story}
                        />
                        <Text style={{ color: "white" }}>{story.user.length > 10 ? story.user.slice(0, 7).toLowerCase() + "..." : story.user}</Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    story: {
        width: 70,
        height: 70,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: "#ff8501"
    }
})

export default Stories