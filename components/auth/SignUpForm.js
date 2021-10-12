import React, { useState } from "react"
import { Alert, TouchableOpacity } from "react-native"
import { View, Text, TextInput, StyleSheet } from "react-native"
import * as Yup from "yup"
import { Formik } from "formik"
import Validator from "email-validator"
import { firebase, db } from "../../firebase"

const SignUpForm = ({ navigation }) => {
    const SignUpFormSchema = Yup.object().shape({
        name: Yup.string().required().min(2, "Your name must be at least 2 characters!"),
        email: Yup.string().email().required("Please enter an email."),
        username: Yup.string().required().min(2, "Your username must be at least 2 characters!"),
        password: Yup.string().required().min(8, "Your password must be at least 8 characters!")
    })

    const getRandomProfilePicture = async () => {
        const response = await fetch("https://randomuser.me/api")
        const data = await response.json()
        return data.results[0].picture.large
    }

    const onSignUp = async (name, email, password, username) => {
        try {
            const authUser = await firebase.auth().createUserWithEmailAndPassword(email, password);
            db.collection("users").doc(authUser.user.email).set({
                owner_uid: authUser.user.uid,
                name,
                username,
                email: authUser.user.email,
                profile_picture: await getRandomProfilePicture()
            })
        } catch (error) {
            Alert.alert(error.message)
        }
    }

    return (
        <View style={styles.wrapper}>
            <Formik
                initialValues={{ name: "", email: "", username: "", password: "" }}
                onSubmit={(values) => {
                    onSignUp(values.name, values.email, values.password, values.username)
                }}
                validationSchema={SignUpFormSchema}
                validateOnMount={true}
            >
                {({ handleChange, handleBlur, handleSubmit, values, isValid }) => (
                    <>
                        <View
                            style={[
                                styles.inputField,
                                {
                                    borderColor: 1 > values.name.length || values.name.length > 2 ? "#ccc" : "red"
                                }
                            ]}
                        >
                            <TextInput
                                placeholder="Full Name"
                                placeholderTextColor="#444"
                                autoCapitalize="none"
                                autoCorrect={false}
                                textContentType="name"
                                onChangeText={handleChange("name")}
                                onBlur={handleBlur("name")}
                                value={values.name}
                            />
                        </View>
                        <View
                            style={[
                                styles.inputField,
                                {
                                    borderColor: values.email.length < 1 || Validator.validate(values.email) ? "#ccc" : "red"
                                }
                            ]}
                        >
                            <TextInput
                                placeholder="Email"
                                placeholderTextColor="#444"
                                autoCapitalize="none"
                                autoCorrect={false}
                                keyboardType="email-address"
                                textContentType="emailAddress"
                                autoFocus={true}
                                onChangeText={handleChange("email")}
                                onBlur={handleBlur("email")}
                                value={values.email}
                            />
                        </View>
                        <View
                            style={[
                                styles.inputField,
                                {
                                    borderColor: 1 > values.username.length || values.username.length > 2 ? "#ccc" : "red"
                                }
                            ]}
                        >
                            <TextInput
                                placeholder="Username"
                                placeholderTextColor="#444"
                                autoCapitalize="none"
                                autoCorrect={false}
                                textContentType="username"
                                onChangeText={handleChange("username")}
                                onBlur={handleBlur("username")}
                                value={values.username}
                            />
                        </View>
                        <View style={[
                            styles.inputField,
                            {
                                borderColor: 1 > values.password.length || values.password.length > 8 ? "#ccc" : "red"
                            }
                        ]}>
                            <TextInput
                                placeholder="Password"
                                placeholderTextColor="#444"
                                autoCapitalize="none"
                                autoCorrect={false}
                                secureTextEntry={true}
                                textContentType="password"
                                onChangeText={handleChange("password")}
                                onBlur={handleBlur("password")}
                                value={values.password}
                            />
                        </View>
                        <Text style={{ alignSelf: "flex-end", marginBottom: 30, color: "#6bb0f5" }}></Text>
                        <TouchableOpacity disabled={!isValid} style={styles.button(isValid)} onPress={handleSubmit}>
                            <Text style={styles.buttonText}>Sign Up</Text>
                        </TouchableOpacity>
                        <View style={styles.signupContainer}>
                            <Text>Already have an account?</Text>
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Text style={{ color: "#6bb0f5" }}> Sign In</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </Formik>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        marginTop: 80
    },
    inputField: {
        borderRadius: 4,
        padding: 12,
        backgroundColor: "#fafafa",
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#ccc"
    },
    button: (isValid) => ({
        backgroundColor: isValid ? "#0096f6" : "#9acaf7",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 42,
        borderRadius: 4
    }),
    buttonText: {
        fontWeight: "600",
        color: "#fff",
        fontSize: 20
    },
    signupContainer: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "center",
        marginTop: 50
    }
})

export default SignUpForm