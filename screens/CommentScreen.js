import React, { useEffect, useState } from "react"
import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    TextInput,
    Button,
    Keyboard,
    KeyboardAvoidingView,
    Platform
} from "react-native"
import { useNavigation } from "@react-navigation/core"
import { Divider } from "react-native-elements"
import { db, firebase } from "../firebase"

const CommentScreen = ({ route }) => {
    const navigation = useNavigation();
    const [post, setPost] = useState(null);
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const [userInfo, setUserInfo] = useState(null);
    const [pressed, setPressed] = useState(false);

    const { postData } = route.params

    const getUserInfo = () => {
        db
            .collection("users")
            .doc(firebase.auth().currentUser.email)
            .onSnapshot((snapshot) => {
                setUserInfo({
                    username: snapshot.data().username,
                    profilePicture: snapshot.data().profile_picture
                })
            })
    }

    const handleComment = async () => {
        const commentToSend = comment
        setComment("");

        await db
            .collection("users")
            .doc(postData.owner_email)
            .collection("posts")
            .doc(postData.id)
            .collection("comments")
            .add({
                comment: commentToSend,
                user: userInfo.username,
                userImage: userInfo.profilePicture
            })
            .then(() => Keyboard.dismiss())
    }

    const getPost = () => {
        db
            .collection("users")
            .doc(postData.owner_email)
            .collection("posts")
            .where("createdAt", "==", postData.createdAt)
            .limit(1)
            .onSnapshot((snapshot) => {
                snapshot.docs.map((doc) => {
                    setPost({
                        id: doc.id,
                        caption: doc.data().caption,
                        username: doc.data().user,
                        profilePicture: doc.data().profile_picture
                    })
                })
            })
    }

    const getComments = () => {
        db
            .collection("users")
            .doc(postData.owner_email)
            .collection("posts")
            .doc(postData.id)
            .collection("comments")
            .onSnapshot((snapshot) => {
                setComments(snapshot.docs.map((doc) => ({
                    id: doc.id,
                    comment: doc.data().comment,
                    user: doc.data().user,
                    userImage: doc.data().userImage
                })))
            })
    }

    useEffect(() => {
        getPost();
        getComments();
        getUserInfo();
    }, [db, userInfo])

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
            <SafeAreaView style={styles.container}>
                <Header navigation={navigation} />
                <Divider width={1} color="#303030" />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ flexDirection: "row", padding: 10, alignItems: "center" }}>
                        <Image
                            source={{ uri: post?.profilePicture }}
                            style={{ width: 40, height: 40, borderRadius: 40, marginRight: 8 }}
                        />
                        <View>
                            <Text>
                                <Text style={{ color: "white", fontWeight: "800" }}>{post?.username}</Text>
                                <Text style={{ color: "white" }}> {post?.caption}</Text>
                            </Text>
                        </View>
                    </View>
                    <Divider width={1} color="#303030" />
                    {comments && (
                        <>
                            {comments?.map((comment) => (
                                <View key={comment.comment} style={{ flexDirection: "row", padding: 10, alignItems: "center" }}>
                                    <Image
                                        source={{ uri: comment.userImage }}
                                        style={{ width: 40, height: 40, borderRadius: 40, marginRight: 8 }}
                                    />
                                    <View>
                                        <Text>
                                            <Text style={{ color: "white", fontWeight: "800" }}>{comment.user}</Text>
                                            <Text style={{ color: "white" }}> {comment.comment}</Text>
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </>
                    )}
                </ScrollView>
                <View
                    style={{
                        position: "absolute",
                        bottom: 0,
                        backgroundColor: "black",
                        paddingBottom: 30,
                        paddingHorizontal: 20,
                        paddingTop: 20,
                        flexDirection: "row",
                        width: "100%"
                    }}
                >
                    <Image
                        source={{ uri: userInfo?.profilePicture }}
                        style={{ width: 45, height: 45, borderRadius: 45, marginRight: 8 }}
                    />
                    <View style={{
                        height: 45,
                        flex: 1,
                        flexDirection: "row",
                        borderWidth: 1,
                        borderColor: "#303030",
                        borderRadius: 45,
                        alignItems: "center",
                        paddingHorizontal: 10,
                    }}
                    >
                        <TextInput
                            placeholder={`Add a comment as ${userInfo?.username}...`}
                            placeholderTextColor="#a9a9a9"
                            style={{ flex: 1, color: "white" }}
                            value={comment}
                            onFocus={() => setPressed(true)}
                            onChange={(e) => setComment(e.nativeEvent.text)}
                        />
                        {pressed && (
                            <Button title="Post" disabled={!comment.trim()} onPress={handleComment} />
                        )}
                    </View>
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    )
}

const Header = ({ navigation }) => (
    <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={{ uri: "https://img.icons8.com/ios-glyphs/90/ffffff/back.png" }} style={{ width: 30, height: 30 }} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Comments</Text>
        <Text></Text>
    </View>
)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
        paddingHorizontal: 10,
    },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingBottom: 10,
    },
    headerText: {
        color: "white",
        fontWeight: "700",
        fontSize: 18,
        marginRight: 25
    }
})

export default CommentScreen