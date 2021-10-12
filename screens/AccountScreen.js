import React from "react"
import { View, Text } from "react-native"

const AccountScreen = () => {
    return (
        <View>
            <View>
                <Header navigation={navigation} />
                <ProfileInfo />
                <View style={{ flexDirection: "row", flexWrap: 1, marginTop: 20 }}>
                    {posts.map((post, index) => (
                        <Pressable key={post.id} onPress={() => navigation.navigate("PostScreen", { post })}>
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
            </View>
        </View>
    )
}

export default AccountScreen