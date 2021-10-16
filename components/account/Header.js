import React, { useEffect, useState } from "react"
import { View, Text, TouchableOpacity, Image } from "react-native"
import { Icon } from "react-native-elements/dist/icons/Icon"
import { db } from "../../firebase"

const Header = ({ email }) => {
    const [username, setUsername] = useState("");

    useEffect(() => {
        db
            .collection("users")
            .doc(email)
            .onSnapshot((snapshot) => {
                setUsername(snapshot.data().username)
            })
    }, [])

    return (
        <View>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingBottom: 5,
                }}
            >
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image source={{ uri: "https://img.icons8.com/ios-glyphs/90/ffffff/back.png" }} style={{ width: 30, height: 30 }} />
                </TouchableOpacity>
                <View style={{ marginLeft: 35 }}>
                    <Text style={{ color: "white", fontWeight: "900", fontSize: 16, textAlign: "center" }}>{username}</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", paddingRight: 10 }}>
                    <TouchableOpacity>
                        <Icon type="feather" name="bell" size={24} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginLeft: 25 }}>
                        <Image
                            source={{ uri: "https://img.icons8.com/ios-glyphs/30/ffffff/ellipsis.png" }}
                            style={{ width: 15, height: 15, resizeMode: "contain" }}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default Header