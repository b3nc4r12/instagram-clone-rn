import React, { useEffect, useState } from "react"
import { View, Text, SafeAreaView, StyleSheet, ScrollView } from "react-native"
import Header from "../components/home/Header"
import Post from "../components/home/Post"
import Stories from "../components/home/Stories"
import { db } from "../firebase"

const HomeScreen = ({ navigation }) => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        let mounted = true

        if (mounted) {
            db
                .collectionGroup("posts")
                .orderBy("createdAt", "desc")
                .onSnapshot((snapshot) => {
                    setPosts(snapshot.docs.map((doc) => (
                        { id: doc.id, ...doc.data() }
                    )))
                })
        }

        return () => mounted = false
    }, [])

    return (
        <SafeAreaView style={styles.container}>
            <Header navigation={navigation} />
            <ScrollView style={{ marginBottom: 30 }} showsVerticalScrollIndicator={false}>
                <Stories />
                {posts.map((post, index) => (
                    <Post key={index} post={post} index={index} />
                ))}
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "black",
        flex: 1
    }
})

export default HomeScreen