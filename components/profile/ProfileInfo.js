import React, { useEffect, useState } from "react"
import { View, Text, StyleSheet, Image, Pressable } from "react-native"
import { db, firebase } from "../../firebase"

const ProfileInfo = () => {
    const [currentLoggedInUser, setCurrentLoggedInUser] = useState(null);
    const [noOfPosts, setNoOfPosts] = useState(null);

    const getUsername = () => {
        const user = firebase.auth().currentUser
        const unsubscribe = db
            .collection("users")
            .where("owner_uid", "==", user.uid)
            .limit(1)
            .onSnapshot((snapshot) => {
                snapshot.docs.map((doc) => {
                    setCurrentLoggedInUser({
                        name: doc.data().name,
                        bio: doc.data().bio,
                        profilePicture: doc.data().profile_picture,
                    })
                })
            })

        return unsubscribe
    }

    const getNumberOfPosts = () => {
        const user = firebase.auth().currentUser
        const unsubscribe = db
            .collection("users")
            .doc(user.email)
            .collection("posts")
            .onSnapshot((snapshot) => {
                setNoOfPosts(snapshot.size)
            })

        return unsubscribe
    }

    useEffect(() => {
        let mounted = true

        if (mounted) {
            getUsername();
            getNumberOfPosts();
        }

        return () => mounted = false
    }, [])

    return (
        <View style={styles.container}>
            <Top user={currentLoggedInUser} noOfPosts={noOfPosts} />
            <Bottom user={currentLoggedInUser} />
        </View>
    )
}

const Top = ({ user, noOfPosts }) => (
    <View style={styles.topContainer}>
        <View style={styles.imageContainer}>
            <Image source={{ uri: user?.profilePicture }} style={styles.profilePicture} />
            <View style={styles.addToStoryButton}>
                <Image
                    source={{ uri: "https://img.icons8.com/ios-glyphs/30/ffffff/plus-math.png" }}
                    style={styles.addToStoryImage}
                />
            </View>
        </View>
        <View style={styles.infoContainer}>
            <View style={styles.infoBox}>
                <Text style={styles.infoAmount}>{noOfPosts}</Text>
                <Text style={styles.infoTitle}>Posts</Text>
            </View>
            <View style={styles.infoBox}>
                <Text style={styles.infoAmount}>{noOfPosts}</Text>
                <Text style={styles.infoTitle}>Followers</Text>
            </View>
            <View style={styles.infoBox}>
                <Text style={styles.infoAmount}>{noOfPosts}</Text>
                <Text style={styles.infoTitle}>Following</Text>
            </View>
        </View>
    </View>
)

const Bottom = ({ user }) => (
    <View style={styles.bottomContainer}>
        <Text style={{ color: "white", fontWeight: "800" }}>{user?.name}</Text>
        <Text style={{ color: "white" }}>{user?.bio}</Text>
        <Pressable style={styles.editButton}>
            <Text style={{ color: "white", fontWeight: "800", fontSize: 14 }}>Edit Profile</Text>
        </Pressable>
    </View>
)

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20
    },
    topContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    imageContainer: {
        position: "relative",
    },
    profilePicture: {
        height: 90,
        width: 90,
        resizeMode: "cover",
        borderRadius: 100
    },
    addToStoryButton: {
        backgroundColor: "#0095f6",
        padding: 4,
        borderRadius: 25,
        position: "absolute",
        bottom: 0,
        right: -2,
        borderWidth: 4
    },
    addToStoryImage: {
        width: 14,
        height: 14,
        resizeMode: "contain"
    },
    infoContainer: {
        flexDirection: "row"
    },
    infoBox: {
        alignItems: "center",
        marginLeft: 20
    },
    infoAmount: {
        color: "white",
        fontSize: 18,
        fontWeight: "800"
    },
    infoTitle: {
        color: "white",
        fontSize: 14,
        fontWeight: "600"
    },
    bottomContainer: {
        paddingTop: 15
    },
    editButton: {
        borderWidth: 1,
        borderColor: "#303030",
        borderRadius: 5,
        alignItems: "center",
        paddingVertical: 8,
    }
})

export default ProfileInfo