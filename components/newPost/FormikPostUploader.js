import React, { useState, useEffect } from "react"
import { View, Text, Image, Button, Platform, TouchableOpacity, Keyboard } from "react-native"
import * as Yup from "yup"
import { Formik } from "formik"
import { TextInput } from "react-native"
import { Divider } from "react-native-elements"
import validUrl from "valid-url"
import { firebase, db, storage } from "../../firebase"
import * as ImagePicker from "expo-image-picker"

const PLACEHOLDER_IMG = "https://www.brownweinraub.com/wp-content/uploads/2017/09/placeholder.jpg"

const FormikPostUploader = ({ navigation }) => {
    const [thumbnailUrl, setThumbnailUrl] = useState(null);
    const [isLoading, toggleLoading] = useState(false);
    const [currentLoggedInUser, setCurrentLoggedInUser] = useState(null);
    const currentUser = firebase.auth().currentUser

    const uploadPostSchema = Yup.object().shape({
        caption: Yup.string().max(2200, "Caption has reached the character limit")
    })

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false
        })

        if (!result.cancelled) setThumbnailUrl(result.uri)
    }

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

    const uploadPost = async (caption) => {
        toggleLoading(true);
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            xhr.onload = () => {
                resolve(xhr.response);
            }

            xhr.onerror = (e) => {
                reject(new TypeError("Network request failed."))
            }

            xhr.responseType = "blob"
            xhr.open("GET", thumbnailUrl, true);
            xhr.send(null);
        })

        const ref = storage.ref().child(`${currentUser.uid} ${currentLoggedInUser.username} ${new Date().toISOString()}`)

        const snapshot = await ref.put(blob);
        blob.close();

        db
            .collection("users")
            .doc(firebase.auth().currentUser.email)
            .collection("posts")
            .add({
                user: currentLoggedInUser.username,
                imageUrl: await snapshot.ref.getDownloadURL(),
                profile_picture: currentLoggedInUser.profilePicture,
                owner_uid: firebase.auth().currentUser.uid,
                owner_email: firebase.auth().currentUser.email,
                caption,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                likes_by_users: [],
            })
            .then(() => {
                Keyboard.dismiss();
                toggleLoading(false);
                navigation.goBack();
            })
    }

    useEffect(() => {
        (async () => {
            if (Platform.OS !== "web") {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== "granted") {
                    alert("We need access to photos and media on your device.");
                }
            }
        })()
    }, [])

    return (
        <Formik
            initialValues={{ caption: "" }}
            onSubmit={(values) => {
                uploadPost(values.caption)
            }}
            validationSchema={uploadPostSchema}
            validateOnMount={true}
        >
            {({ handleBlur, handleChange, handleSubmit, values, isValid }) => (
                <>
                    <View style={{ margin: 20, justifyContent: "space-between", flexDirection: "row" }}>
                        <Image source={{ uri: validUrl.isUri(thumbnailUrl) ? thumbnailUrl : PLACEHOLDER_IMG }} style={{ width: 100, height: 100 }} />
                        <View style={{ flex: 1, marginLeft: 12 }}>
                            <TextInput
                                placeholder="Write a caption..."
                                placeholderTextColor="gray"
                                multiline={true}
                                style={{ color: "white", fontSize: 20 }}
                                onChangeText={handleChange("caption")}
                                onBlur={handleBlur("caption")}
                                value={values.caption}
                            />
                        </View>
                    </View>
                    <Divider width={0.2} orientation="vertical" />
                    <TouchableOpacity style={{ backgroundColor: "#1f75fe", marginTop: 10, height: 40, justifyContent: "center", alignItems: "center" }} onPress={pickImage}>
                        <Text style={{ fontSize: 18, color: "white" }}>Upload Image</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ backgroundColor: !isValid ? "gray" : "#1f75fe", marginTop: 20 }}>
                        <Button onPress={handleSubmit} title="SHARE" disabled={!isValid} color="#fff" />
                    </TouchableOpacity>
                    <View style={{ width: "100%", alignItems: "center", marginTop: 20 }}>
                        {isLoading && (
                            <Image
                                source={{
                                    uri: "https://c.tenor.com/I6kN-6X7nhAAAAAj/loading-buffering.gif",
                                    height: 30,
                                    width: 30
                                }}
                            />
                        )}
                    </View>
                </>
            )}
        </Formik>
    )
}

export default FormikPostUploader
