import React, { useEffect, useState } from "react"
import { SignedInStack, SignedOutStack } from "./navigation"
import { firebase } from "./firebase"

const AuthNavigation = () => {
    const [currentUser, setCurrentUser] = useState(null);

    const userHandler = (user) => user ? setCurrentUser(user) : setCurrentUser(null);

    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => userHandler(user))
    }, [])

    return <>{currentUser ? <SignedInStack /> : <SignedOutStack />}</>
}

export default AuthNavigation
