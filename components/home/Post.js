import React from "react"
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native"
import { Divider } from "react-native-elements"
import { firebase, db } from "../../firebase"

const postFooterIcons = [
    {
        name: "Like",
        imageUrl: "https://img.icons8.com/fluency-systems-regular/60/ffffff/like--v1.png",
        likedImageUrl: "https://img.icons8.com/ios-glyphs/90/fa314a/like--v1.png"
    },
    {
        name: "Comment",
        imageUrl: "https://img.icons8.com/material-outlined/60/ffffff/filled-topic.png"
    },
    {
        name: "Share",
        imageUrl: "https://img.icons8.com/fluency-systems-regular/60/ffffff/sent.png"
    },
    {
        name: "Save",
        imageUrl: "https://img.icons8.com/fluency-systems-regular/60/ffffff/bookmark-ribbon--v1.png"
    }
]

const Post = ({ post, index }) => {
    const handleLike = (post) => {
        const currentLikeStatus = !post.likes_by_users.includes(
            firebase.auth().currentUser.email
        )

        db
            .collection("users")
            .doc(post.owner_email)
            .collection("posts")
            .doc(post.id)
            .update({
                likes_by_users: currentLikeStatus
                    ? firebase.firestore.FieldValue.arrayUnion(
                        firebase.auth().currentUser.email
                    )
                    : firebase.firestore.FieldValue.arrayRemove(
                        firebase.auth().currentUser.email
                    )
            })
            .then(() => {
                console.log("Document Successfully Updated!")
            })
            .catch((error) => {
                console.log("Error Updating Document: ", error)
            })
    }

    return (
        <View style={{ marginBottom: 15 }}>
            {index == 0 ? (
                <Divider width={1} orientation="horizontal" color="#303030" />
            ) : null}
            <PostHeader post={post} />
            <PostImage post={post} />
            <View style={{ marginHorizontal: 15, marginTop: 15 }}>
                <PostFooter post={post} handleLike={handleLike} />
                <Likes post={post} />
                <Caption post={post} />
                <CommentSection post={post} />
                <Comments post={post} />
            </View>
        </View>
    )
}

const PostHeader = ({ post }) => (
    <View style={{ flexDirection: "row", justifyContent: "space-between", margin: 5, marginVertical: 10, paddingHorizontal: 8, alignItems: "center" }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image source={{ uri: post.profile_picture }} style={styles.postImage} />
            <Text style={{ color: "white", marginLeft: 8, fontWeight: "700" }}>{post.user}</Text>
        </View>
        <Image source={{ uri: "https://img.icons8.com/ios-glyphs/30/ffffff/ellipsis.png" }} style={{ width: 15, height: 15, resizeMode: "contain" }} />
    </View>
)

const PostImage = ({ post }) => (
    <View style={{ width: "100%", height: 450 }}>
        <Image source={{ uri: post.imageUrl }} style={{ height: "100%", resizeMode: "cover" }} />
    </View>
)

const PostFooter = ({ handleLike, post }) => (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={styles.leftFooterIconsContainer}>
            <TouchableOpacity onPress={() => handleLike(post)}>
                <Image
                    style={styles.footerIcon}
                    source={{
                        uri: post.likes_by_users.includes(firebase.auth().currentUser.email)
                            ? postFooterIcons[0].likedImageUrl
                            : postFooterIcons[0].imageUrl
                    }}
                />
            </TouchableOpacity>
            <Icon imgStyle={styles.footerIcon} imgUrl={postFooterIcons[1].imageUrl} />
            <Icon imgStyle={[styles.footerIcon, styles.shareIcon]} imgUrl={postFooterIcons[2].imageUrl} />
        </View>
        <Icon imgStyle={[styles.footerIcon, { marginRight: 0 }]} imgUrl={postFooterIcons[3].imageUrl} />
    </View>
)

const Icon = ({ imgStyle, imgUrl }) => (
    <TouchableOpacity>
        <Image style={imgStyle} source={{ uri: imgUrl }} />
    </TouchableOpacity>
)

const Likes = ({ post }) => (
    <View style={{ flexDirection: "row", marginTop: 4 }}>
        <Text style={{ color: "white", fontWeight: "600" }}>{post.likes_by_users.length.toLocaleString("en")} {post.likes_by_users.length == 1 ? "like" : "likes"}</Text>
    </View>
)

const Caption = ({ post }) => (
    <Text style={{ color: "white", marginTop: 5 }}>
        <Text style={{ fontWeight: "600" }}>{post.user}</Text>
        <Text> {post.caption}</Text>
    </Text>
)

const CommentSection = ({ post }) => (
    <>
        {!!post.comments.length && (
            <Text style={{ color: "gray", marginTop: 5 }}>
                View{post.comments.length > 1 ? " all" : ""} {post.comments.length} {post.comments.length > 1 ? "comments" : "comment"}
            </Text>
        )}
    </>
)

const Comments = ({ post }) => (
    <>
        {post.comments.map((comment, index) => (
            <View key={index} style={{ flexDirection: "row", marginTop: 5 }}>
                <Text style={{ color: "white" }}>
                    <Text style={{ fontWeight: "600" }}>{comment.user}</Text>
                    <Text> {comment.comment}</Text>
                </Text>
            </View>
        ))}
    </>
)

const styles = StyleSheet.create({
    postImage: {
        width: 35,
        height: 35,
        borderRadius: 50,
        borderWidth: 1.6,
        borderColor: "#ff8501"
    },
    footerIcon: {
        width: 33,
        height: 33,
        marginRight: 15
    },
    leftFooterIconsContainer: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    shareIcon: {
        transform: [{ rotate: "320deg" }],
        marginTop: -3
    }
})

export default Post