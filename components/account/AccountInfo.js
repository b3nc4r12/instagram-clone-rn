import React, { useEffect, useState } from "react"
import { View, Text, StyleSheet, Pressable, Image } from "react-native"
import { db, firebase } from "../../firebase"
import { useNavigation } from "@react-navigation/core"

const AccountInfo = ({ email }) => {
    const navigation = useNavigation();

    const [currentLoggedInUser, setCurrentLoggedInUser] = useState(null);
    const [account, setAccount] = useState(null);
    const [noOfPosts, setNoOfPosts] = useState(null);
    const [noOfFollowers, setNoOfFollowers] = useState(null);
    const [noOfFollowing, setNoOfFollowing] = useState(null);
    const [following, setFollowing] = useState(null);
    const [currentFollowingStatus, setCurrentFollowingStatus] = useState(null);

    const checkIfUserIsFollowed = () => {
        db.collection("users").doc(firebase.auth().currentUser.email).onSnapshot((snapshot) => {
            setCurrentFollowingStatus(snapshot.data().following.includes(email))
        })

        setFollowing(currentFollowingStatus)
    }

    const getUsername = () => {
        const user = firebase.auth().currentUser
        const unsubscribe = db
            .collection("users")
            .doc(user.email)
            .onSnapshot((snapshot) => {
                setCurrentLoggedInUser({
                    username: snapshot.data().username,
                    following: snapshot.data().following
                })
            })

        return unsubscribe
    }

    const getInfo = () => {
        const unsubscribe = db
            .collection("users")
            .doc(email)
            .onSnapshot((snapshot) => {
                setAccount({
                    username: snapshot.data().username,
                    name: snapshot.data().name,
                    email: snapshot.data().email,
                    bio: snapshot.data().bio,
                    profilePicture: snapshot.data().profile_picture
                })
            })

        return unsubscribe
    }

    const getNumberOfPosts = () => {
        const unsubscribe = db
            .collection("users")
            .doc(email)
            .collection("posts")
            .onSnapshot((snapshot) => {
                setNoOfPosts(snapshot.size)
            })

        return unsubscribe
    }

    const getNumberOfFollowers = () => {
        const unsubscribe = db
            .collection("users")
            .doc(email)
            .onSnapshot((snapshot) => {
                setNoOfFollowers(snapshot.data().followers.length)
            })

        return unsubscribe
    }

    const getNumberOfFollowing = () => {
        const unsubscribe = db
            .collection("users")
            .doc(email)
            .onSnapshot((snapshot) => {
                setNoOfFollowing(snapshot.data().following.length)
            })

        return unsubscribe
    }

    const followUser = (email) => {
        const loggedInUser = firebase.auth().currentUser
        db
            .collection("users")
            .doc(email)
            .update({
                followers: firebase.firestore.FieldValue.arrayUnion(loggedInUser.email)
            })
            .then(() => setFollowing(true))

        db
            .collection("users")
            .doc(loggedInUser.email)
            .update({
                following: firebase.firestore.FieldValue.arrayUnion(email)
            })
            .then(() => setFollowing(true))
    }

    const unfollowUser = (email) => {
        const loggedInUser = firebase.auth().currentUser
        db
            .collection("users")
            .doc(email)
            .update({
                followers: firebase.firestore.FieldValue.arrayRemove(loggedInUser.email)
            })
            .then(() => setFollowing(false))

        db
            .collection("users")
            .doc(loggedInUser.email)
            .update({
                following: firebase.firestore.FieldValue.arrayRemove(email)
            })
            .then(() => setFollowing(false))
    }

    useEffect(() => {
        let mounted = true

        if (mounted) {
            getInfo();
            getUsername();
            getNumberOfPosts();
            getNumberOfFollowers();
            getNumberOfFollowing();
            checkIfUserIsFollowed();
        }

        return () => mounted = false
    }, [currentFollowingStatus])

    return (
        <View style={styles.container}>
            <Top user={account} noOfFollowers={noOfFollowers} noOfFollowing={noOfFollowing} noOfPosts={noOfPosts} />
            <Bottom navigation={navigation} following={following} unfollowUser={unfollowUser} followUser={followUser} loggedInUser={currentLoggedInUser} user={account} />
        </View>
    )
}

const Top = ({ user, noOfPosts, noOfFollowers, noOfFollowing }) => (
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
                <Text style={styles.infoAmount}>{noOfFollowers}</Text>
                <Text style={styles.infoTitle}>Followers</Text>
            </View>
            <View style={styles.infoBox}>
                <Text style={styles.infoAmount}>{noOfFollowing}</Text>
                <Text style={styles.infoTitle}>Following</Text>
            </View>
        </View>
    </View>
)

const Bottom = ({ user, loggedInUser, followUser, following, unfollowUser, navigation }) => (
    <View style={styles.bottomContainer}>
        <Text style={{ color: "white", fontWeight: "800" }}>{user?.name}</Text>
        <Text style={{ color: "white", paddingBottom: 8 }}>{user?.bio}</Text>
        {loggedInUser?.username == user?.username ? (
            <Pressable onPress={() => navigation.navigate("EditScreen")} style={styles.editButton}>
                <Text style={{ color: "white", fontWeight: "800", fontSize: 14 }}>Edit Profile</Text>
            </Pressable>
        ) : (
            <>
                {following ? (
                    <Pressable onPress={() => unfollowUser(user.email)} style={styles.editButton}>
                        <Text style={{ color: "white", fontWeight: "800", fontSize: 14 }}>Following</Text>
                    </Pressable>
                ) : (
                    <Pressable onPress={() => followUser(user.email)} style={[styles.editButton, { backgroundColor: "#0095f6" }]}>
                        <Text style={{ color: "white", fontWeight: "800", fontSize: 14 }}>Follow</Text>
                    </Pressable>
                )}
            </>
        )}
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

export default AccountInfo