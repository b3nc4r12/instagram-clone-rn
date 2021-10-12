import React, { useEffect, useState } from "react"
import { View, Image, TouchableOpacity, StyleSheet } from "react-native"
import { Divider } from "react-native-elements"
import { db, firebase } from "../../firebase"

const BottomTabs = ({ icons, component, setComponent }) => {
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
        <View style={styles.wrapper}>
            <Divider width={1} orientation="horizontal" color="#303030" />
            <View style={styles.container}>
                {icons.map((icon, index) => (
                    <Icon key={index} icon={icon} component={component} setComponent={setComponent} />
                ))}
                <Icon
                    icon={{
                        name: "Profile",
                        active: currentLoggedInUser?.profilePicture,
                        inactive: currentLoggedInUser?.profilePicture
                    }}
                    component={component}
                    setComponent={setComponent}
                />
            </View>
        </View>
    )
}

const Icon = ({ icon, component, setComponent }) => (
    <TouchableOpacity onPress={() => setComponent(icon.name)}>
        <Image
            source={{ uri: component == icon.name ? icon.active : icon.inactive }}
            style={[
                styles.icon,
                icon.name == "Profile" ? styles.profilePic() : null,
                component == "Profile" && icon.name == component ? styles.profilePic(component) : null
            ]}
        />
    </TouchableOpacity>
)

const styles = StyleSheet.create({
    wrapper: {
        position: "absolute",
        width: "100%",
        bottom: "3%",
        zIndex: 999,
        backgroundColor: "#000"
    },
    container: {
        flexDirection: "row",
        justifyContent: "space-around",
        height: 50,
        paddingTop: 10
    },
    icon: {
        width: 30,
        height: 30
    },
    profilePic: (component = "") => ({
        borderRadius: 50,
        borderWidth: component == "Profile" ? 1 : 0,
        borderColor: "#fff"
    })
})

export default BottomTabs