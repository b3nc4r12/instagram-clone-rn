import React, { useState } from "react"
import { TouchableOpacity } from "react-native"
import { View, Text, TextInput, StyleSheet, Alert } from "react-native"
import * as Yup from "yup"
import { Formik } from "formik"
import Validator from "email-validator"
import { firebase, db } from "../../firebase"

const LoginForm = ({ navigation }) => {
    const LoginFormSchema = Yup.object().shape({
        email: Yup.string().email().required("Please enter an email"),
        password: Yup.string().required().min(8, "Your password must be at least 8 characters!")
    })

    const onLogin = async (email, password) => {
        try {
            await firebase.auth().signInWithEmailAndPassword(email, password);
        } catch (error) {
            Alert.alert(
                error.message,
                "",
                [
                    {
                        text: "OK",
                        onPress: () => console.log("OK"),
                        style: "cancel"
                    },
                    { text: "Sign Up", onPress: () => navigation.push("SignUpScreen") }
                ]
            )
        }
    }

    return (
        <View style={styles.wrapper}>
            <Formik
                initialValues={{ email: "", password: "" }}
                onSubmit={(values) => {
                    onLogin(values.email, values.password)
                }}
                validationSchema={LoginFormSchema}
                validateOnMount={true}
            >
                {({ handleChange, handleBlur, handleSubmit, values, isValid }) => (
                    <>
                        <View
                            style={[
                                styles.inputField,
                                {
                                    borderColor: values.email.length < 1 || Validator.validate(values.email) ? "#ccc" : "red"
                                }
                            ]}
                        >
                            <TextInput
                                placeholder="Phone number, username or email"
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
                        <Text style={{ alignSelf: "flex-end", marginBottom: 30, color: "#6bb0f5" }}>Forgot password?</Text>
                        <TouchableOpacity disabled={!isValid} style={styles.button(isValid)} onPress={handleSubmit}>
                            <Text style={styles.buttonText}>Log In</Text>
                        </TouchableOpacity>
                        <View style={styles.signupContainer}>
                            <Text>Don't have an account?</Text>
                            <TouchableOpacity onPress={() => navigation.navigate("SignUpScreen")}>
                                <Text style={{ color: "#6bb0f5" }}> Sign Up</Text>
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

export default LoginForm