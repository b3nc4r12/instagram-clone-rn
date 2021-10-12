import { useNavigation } from "@react-navigation/core"
import React, { useEffect, useState } from "react"
import { View, Text, Dimensions, Image, Pressable } from "react-native"
import Header from "../components/profile/Header"
import ProfileInfo from "../components/profile/ProfileInfo"
import { db, firebase } from "../firebase"

const ProfileScreen = () => {
    const navigation = useNavigation();
    const width = Dimensions.get("window").width

    const [posts, setPosts] = useState([]);

    const getPosts = () => {
        const user = firebase.auth().currentUser
        const unsubscribe = db
            .collection("users")
            .doc(user.email)
            .collection("posts")
            .orderBy("createdAt", "desc")
            .onSnapshot((snapshot) => {
                setPosts(snapshot.docs.map((doc) => (
                    { id: doc.id, ...doc.data() }
                )))
            })

        return unsubscribe
    }

    useEffect(() => {
        let mounted = true

        if (mounted) {
            getPosts();
        }

        return () => mounted = false
    }, [])

    return (
        <View>
            <Header navigation={navigation} />
            <ProfileInfo />
            <View style={{ flexDirection: "row", flexWrap: 1, marginTop: 20 }}>
                {posts.map((post, index) => (
                    <Pressable
                        key={post.id}
                        onPress={() => navigation.navigate("PostScreen", { createdAt: post.createdAt, username: post.user })}
                    >
                        <Image
                            source={{ uri: post.imageUrl }}
                            style={{
                                width: width * 0.33,
                                height: width * 0.33,
                                margin: 0.3
                            }}
                        />
                    </Pressable>
                ))}
            </View>
        </View>
    )
}

export default ProfileScreen
