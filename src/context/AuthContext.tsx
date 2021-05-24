import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import {createContext, useCallback, useContext, useEffect, useState} from 'react';
import api from '../services/api';

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
    formState: 'signIn' | 'signUp';
    loading:boolean;
    signIn: (credentials : SignInCredentials) => Promise<void>;
    signOut: () => void;
    handleToSignUp: () => void;
    handleToSignIn: () => void;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({children}) => {
    const [authData, setAuthData] = useState<AuthState>({} as AuthState);
    const [loading, setLoading] = useState(true);
    const [formState, setFormState] = useState<'signIn' | 'signUp'>('signIn');

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
    },[])

    return(
        <AuthContext.Provider value={{
            user: authData.user,
            loading,
            signIn,
            signOut,
            handleToSignIn,
            handleToSignUp,
            formState,
        }}>
            {children}
        </AuthContext.Provider>
    )
}


