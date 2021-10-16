import React, { useEffect, useState } from "react"
import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, ScrollView, Image, Button, TextInput, Platform, Keyboard } from "react-native"
import { useNavigation } from "@react-navigation/core"
import { Divider } from "react-native-elements"
import { db, firebase, storage } from "../firebase"
import * as Yup from "yup"
import { Formik } from "formik"
import * as ImagePicker from "expo-image-picker"
import validUrl from "valid-url"

const EditScreen = () => {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
            <FormikDataChanger navigation={navigation} />
        </SafeAreaView>
    )
}

const FormikDataChanger = ({ navigation }) => {
    const profileDataSchema = Yup.object().shape({
        name: Yup.string().required().min(2, "Your name must be at least 2 characters!"),
        bio: Yup.string().max(150, "Your bio cannot be longer than 150 characters!"),
        username: Yup.string().required().min(2, "Your username must be at least 2 characters!"),
    })

    const [userData, setUserData] = useState(null);
    const [thumbnailUrl, setThumbnailUrl] = useState(null);
    const [isLoading, toggleLoading] = useState(false);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false
        })

        if (!result.cancelled) setThumbnailUrl(result.uri)
    }

    const getUserData = async () => {
        const user = firebase.auth().currentUser
        const unsubscribe = db
            .collection("users")
            .where("owner_uid", "==", user.uid)
            .limit(1)
            .onSnapshot((snapshot) => {
                snapshot.docs.map((doc) => {
                    setUserData({
                        id: doc.data().owner_uid,
                        name: doc.data().name,
                        username: doc.data().username,
                        profilePicture: doc.data().profile_picture,
                        bio: doc.data().bio
                    })

                    setThumbnailUrl(doc.data().profile_picture)
                })
            })

        return unsubscribe
    }

    useEffect(() => {
        getUserData();

        (async () => {
            if (Platform.OS !== "web") {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== "granted") {
                    alert("We need access to photos and media on your device.");
                }
            }
        })()
    }, [])

    if (!userData) {
        return null
    }

    const updateProfileData = async (values) => {
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

        const ref = storage.ref().child(`${userData.username} ${new Date().toISOString()}`)

        const imageSnapshot = await ref.put(blob);
        blob.close();

        const updateData = async (values) => {
            const user = firebase.auth().currentUser

            // Update User Info
            db
                .collection("users")
                .doc(user.email)
                .update({
                    name: values.name,
                    username: values.username,
                    bio: values.bio,
                    profile_picture: await imageSnapshot.ref.getDownloadURL()
                })

            // Update post data
            db
                .collection("users")
                .doc(user.email)
                .collection("posts")
                .onSnapshot((snapshot) => {
                    const promises = []
                    snapshot.forEach(async (doc) => {
                        promises.push(doc.ref.update({
                            user: values.username,
                            profile_picture: thumbnailUrl == userData?.profile_picture ? userData?.profile_picture : await imageSnapshot.ref.getDownloadURL()
                        }))
                    })
                    return Promise.all(promises)
                })

            // Update comment data
            db
                .collection("users")
                .doc(user.email)
                .collection("posts")
                .where("owner_uid", "==", user.uid)
                .onSnapshot((snapshot) => {
                    snapshot.forEach((doc) => {
                        doc
                            .ref
                            .collection("comments")
                            .onSnapshot((snapshot) => {
                                const promises = []
                                snapshot.forEach(async (doc) => {
                                    promises.push(doc.ref.update({
                                        user: values.username,
                                        userImage: thumbnailUrl == userData?.profile_picture ? userData?.profile_picture : await imageSnapshot.ref.getDownloadURL()
                                    }))
                                })
                                return Promise.all(promises)
                            })
                    })
                })
        }

        updateData(values).then(() => {
            Keyboard.dismiss();
            toggleLoading(false);
            navigation.goBack();
        })
    }

    return (
        <Formik
            initialValues={{ name: userData?.name, username: userData?.username, bio: userData?.bio }}
            onSubmit={(values) => {
                updateProfileData(values)
            }}
            validationSchema={profileDataSchema}
            validateOnMount={true}
        >
            {({ handleBlur, handleChange, handleSubmit, values, isValid }) => (
                <>
                    <View style={styles.headerContainer}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>Cancel</Text>
                        </TouchableOpacity>
                        <Text style={{ color: "white", fontSize: 18, fontWeight: "800", marginRight: 14 }}>Edit Profile</Text>
                        <TouchableOpacity disabled={!isValid} onPress={handleSubmit}>
                            <Text style={isValid ? { color: "#1f75fe", fontSize: 16, fontWeight: "600" } : { color: "white", fontSize: 16, fontWeight: "600" }}>Done</Text>
                        </TouchableOpacity>
                    </View>
                    <Divider width={1} color="#303030" />
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ paddingTop: 15, paddingBottom: 5, alignItems: "center" }}>
                            <Image
                                source={{ uri: validUrl.isUri(thumbnailUrl) }}
                                style={{ height: 100, width: 100, borderRadius: 100 }}
                            />
                            <Button onPress={pickImage} title="Change Profile Photo" />
                        </View>
                        <Divider width={1} color="#303030" />
                        <View style={{ paddingHorizontal: 15 }}>
                            <View style={{ flexDirection: "row", alignItems: "center", height: 45 }}>
                                <Text style={{ color: "white", fontSize: 16, fontWeight: "600", width: 95 }}>Name</Text>
                                <View style={{ height: "100%", flex: 1 }}>
                                    <TextInput
                                        style={{ color: "white", fontSize: 16, flex: 1, height: "100%" }}
                                        placeholder="Name"
                                        placeholderTextColor="#303030"
                                        onChangeText={handleChange("name")}
                                        onBlur={handleBlur("name")}
                                        value={values.name}
                                    />
                                    <Divider width={0.8} color="#303030" style={{ width: "100%" }} />
                                </View>
                            </View>
                            <View style={{ flexDirection: "row", height: 45, alignItems: "center" }}>
                                <Text style={{ color: "white", fontSize: 16, fontWeight: "600", width: 95 }}>Username</Text>
                                <View style={{ height: "100%", flex: 1 }}>
                                    <TextInput
                                        style={{ color: "white", fontSize: 16, flex: 1 }}
                                        placeholder="Username"
                                        placeholderTextColor="#303030"
                                        onChangeText={handleChange("username")}
                                        onBlur={handleBlur("username")}
                                        value={values.username}
                                    />
                                    <Divider width={0.8} color="#303030" style={{ width: "100%" }} />
                                </View>
                            </View>
                            <View style={{ flexDirection: "row", paddingVertical: 12 }}>
                                <Text style={{ color: "white", fontSize: 16, fontWeight: "600", width: 95 }}>Bio</Text>
                                <TextInput
                                    style={{ color: "white", fontSize: 16, flex: 1, paddingTop: -12 }}
                                    placeholder="Bio"
                                    placeholderTextColor="#303030"
                                    multiline={true}
                                    onChangeText={handleChange("bio")}
                                    onBlur={handleBlur("bio")}
                                    value={values.bio}
                                />
                            </View>
                            <Divider width={1} color="#303030" />
                        </View>
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
                    </ScrollView>
                </>
            )}
        </Formik>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 20
    }
})

export default EditScreen