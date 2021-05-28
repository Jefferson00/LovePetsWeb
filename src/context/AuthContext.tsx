import {createContext, useCallback, useContext, useEffect, useState} from 'react';
import api from '../services/api';
import firebase from '../lib/firebase';

interface AuthResponseProps extends firebase.auth.AuthCredential{
    accessToken:string;
}

interface ResponseFirebaseProps extends firebase.auth.UserCredential{
    credential: AuthResponseProps | null;
}


interface AuthState{
    token: string;
    user: object;
}

interface SignInCredentials {
    email: string;
    password: string;
}

interface AuthContextData{
    user: object;
    formState: 'signIn' | 'signUp' | 'forgot';
    loading:boolean;
    signIn: (credentials : SignInCredentials) => Promise<void>;
    signOut: () => void;
    handleToSignUp: () => void;
    handleToSignIn: () => void;
    handleToForgotPassword: () => void;
    signInGoogle: () => void;
    signInFacebook: () => void;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({children}) => {
    const [authData, setAuthData] = useState<AuthState>({} as AuthState);
    const [loading, setLoading] = useState(true);
    const [formState, setFormState] = useState<'signIn' | 'signUp' | 'forgot'>('signIn');

    useEffect(()=>{
        const token = localStorage.getItem('@LovePetsBeta:token');
        const user = localStorage.getItem('@LovePetsBeta:user');

        if (token && user) {
            setAuthData({token, user: JSON.parse(user)});
        }else{
            setAuthData({token: null, user: null})
        }
    },[])

    useEffect(() =>{
        if(authData.user !== undefined || authData.user === null) {
            setLoading(false);
        }
    },[authData.user])

    const signIn = useCallback(async ({email, password}) =>{
        const response = await api.post('sessions', {
            email,
            password,
        })

        const { token, user } = response.data;

        localStorage.setItem('@LovePetsBeta:token', token);
        localStorage.setItem('@LovePetsBeta:user', JSON.stringify(user));

        setAuthData({token, user})
     },[])

    const signOut = useCallback(() => {
        localStorage.removeItem('@LovePetsBeta:token');
        localStorage.removeItem('@LovePetsBeta:user');

        setAuthData({} as AuthState)
    }, []);

    const handleToSignUp = useCallback(()=>{
        setFormState('signUp');
    },[]);

    const handleToSignIn = useCallback(() =>{
        setFormState('signIn');
    },[]);

    const handleToForgotPassword = useCallback(() =>{
        setFormState('forgot');
    },[])

    const signInGoogle = useCallback(() =>{
        try {
            setLoading(true);
            return firebase
            .auth()
            .signInWithPopup(new firebase.auth.GoogleAuthProvider())
            .then((response : ResponseFirebaseProps) => {
                const token = response.credential.accessToken;
                const user = response.user;

                localStorage.setItem('@LovePetsBeta:token', token);
                localStorage.setItem('@LovePetsBeta:user', JSON.stringify(user));

                setAuthData({token, user});
            });
        } finally {
            setLoading(false);
        }
    },[])

    const signInFacebook = useCallback(() =>{
        try {
            setLoading(true);
            return firebase
            .auth()
            .signInWithPopup(new firebase.auth.FacebookAuthProvider())
            .then((response : ResponseFirebaseProps) => {
                const token = response.credential.accessToken;
                const user = response.user;

                localStorage.setItem('@LovePetsBeta:token', token);
                localStorage.setItem('@LovePetsBeta:user', JSON.stringify(user));

                setAuthData({token, user});
            });
        } finally {
            setLoading(false);
        }
    },[])

    return(
        <AuthContext.Provider value={{
            user: authData.user,
            loading,
            signIn,
            signOut,
            handleToSignIn,
            handleToSignUp,
            handleToForgotPassword,
            signInGoogle,
            signInFacebook,
            formState,
        }}>
            {children}
        </AuthContext.Provider>
    )
}


