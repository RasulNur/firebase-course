import { FC, useState, useEffect } from "react";
import { auth, googleProvider } from "../../config/firebase";
import {
    createUserWithEmailAndPassword,
    signInWithPopup,
    signOut,
} from "firebase/auth";

const Auth: FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    useEffect(() => {
        console.log(auth.currentUser?.uid);
    }, [email]);
    const signIn = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            setEmail("");
            setPassword("");
        } catch (err) {
            console.error(err);
        }
    };
    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (err) {
            console.error(err);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <input
                type="email"
                autoComplete="username"
                placeholder="Email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                autoComplete="current-password"
                placeholder="Password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={signIn}>Sign in</button>

            <button onClick={signInWithGoogle}>Sign in with google</button>

            <button onClick={logout}>Log out</button>
        </div>
    );
};

export default Auth;
