import { useNavigation } from "@react-navigation/core"
import React, { useEffect, useRef, useState } from "react"
import { View, Dimensions, Image, Pressable, Alert, ScrollView, TouchableOpacity, Text } from "react-native"
import Header from "../components/profile/Header"
import ProfileInfo from "../components/profile/ProfileInfo"
import { db, firebase } from "../firebase"
import BottomSheet from "@gorhom/bottom-sheet"
import { Icon } from "react-native-elements"
import BottomTabs from "../components/home/BottomTabs"

const ProfileScreen = ({ icons, setComponent, component }) => {
    const navigation = useNavigation();
    const width = Dimensions.get("window").width

    const [posts, setPosts] = useState([]);

    const bottomSheetRef = useRef(null);

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

    const signOut = async () => {
        try {
            await firebase.auth().signOut()
        } catch (error) {
            Alert.alert(error.message)
        }
    }

    return (
        <>
            <View style={{ flex: 1 }}>
                <Header bottomSheetRef={bottomSheetRef} navigation={navigation} />
                <ScrollView showsVerticalScrollIndicator={false}>
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
                </ScrollView>
            </View>
            <BottomTabs icons={icons} component={component} setComponent={setComponent} />
            <BottomSheet
                backgroundStyle={{ backgroundColor: "#333333" }}
                handleIndicatorStyle={{ backgroundColor: "gray" }}
                ref={bottomSheetRef}
                enablePanDownToClose={true}
                snapPoints={["30%", "50%"]} index={-1}  >
                <View style={{ alignItems: "center", justifyContent: "center", zIndex: 50 }}>
                    <TouchableOpacity
                        onPress={signOut}
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            height: 35,
                            width: "90%",
                            marginTop: 30
                        }}
                    >
                        <Icon type="material-icons" name="logout" size={30} color="white" />
                        <Text style={{ color: "white", fontSize: 16, fontWeight: "600", marginLeft: 20 }}>Sign Out</Text>
                    </TouchableOpacity>
                </View>
            </BottomSheet>
        </>
    )
}

export default ProfileScreen
