import React, { useEffect, useState } from "react"
import { View, Text, SafeAreaView, TextInput, TouchableOpacity, ScrollView, Image } from "react-native"
import { Divider, Icon } from "react-native-elements"
import { db } from "../firebase";

const SearchScreen = () => {
    const [searchInput, setSearchInput] = useState("");
    const [users, setUsers] = useState(null);

    const getUsers = () => {
        const unsubscribe = db
            .collection("users")
            .onSnapshot((snapshot) => {
                setUsers(
                    snapshot.docs.map((doc) => ({
                        id: doc.id, ...doc.data()
                    }))
                )
            })

        return unsubscribe
    }

    useEffect(() => {
        let mounted = true

        if (mounted) {
            getUsers();
        }

        return () => mounted = false
    }, [])

    return (
        <SafeAreaView>
            <View style={{
                backgroundColor: "#303030",
                flexDirection: "row",
                height: 35,
                borderRadius: 8,
                alignItems: "center",
                paddingHorizontal: 10,
                marginHorizontal: 20,
                marginVertical: 10
            }}>
                <Icon type="feather" name="search" size={18} color="#808080" style={{ paddingRight: 10 }} />
                <TextInput
                    placeholder="Search"
                    placeholderTextColor="#808080"
                    style={{ flex: 1, fontSize: 18, color: "white" }}
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.nativeEvent.text)}
                    returnKeyType="search"
                />
            </View>
            <Divider width={1} orientation="horizontal" color="#303030" />
            <ScrollView>
                {searchInput == "" && <Text style={{ color: "white", padding: 15, fontSize: 16, fontWeight: "900" }}>Recommended</Text>}
                {users?.filter((user) => {
                    if (user.username.toLowerCase().includes(searchInput.toLowerCase())) return user
                    else if (user.name.toLowerCase().includes(searchInput.toLowerCase())) return user
                }).map((user) => (
                    <TouchableOpacity
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            paddingVertical: 10,
                            paddingHorizontal: 20
                        }}
                        key={user.id}
                    >
                        <Image
                            source={{ uri: user.profile_picture }}
                            style={{ height: 60, width: 60, borderRadius: 80 }}
                        />
                        <View style={{ marginLeft: 10 }}>
                            <Text style={{ color: "white", fontWeight: "800" }}>{user.username}</Text>
                            <Text style={{ color: "#808080", fontWeight: "500" }}>{user.name}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </SafeAreaView>
    )
}

export default SearchScreen
