import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';
import firebase from '../lib/firebase';
import { useRouter } from 'next/router';
import { ToastContext } from './ToastContext';
import { setCookie, destroyCookie, parseCookies } from 'nookies';
import { uuid } from 'uuidv4';

interface AuthResponseProps extends firebase.auth.AuthCredential {
    accessToken: string;
}

interface ResponseFirebaseProps extends firebase.auth.UserCredential {
    credential: AuthResponseProps | null;
}

interface User {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
    phone: string | null;
    avatar_url: string | null;
}

interface AuthState {
    token: string;
    user: User;
}

interface SignInCredentials {
    email: string;
    password: string;
}

interface SignUpData {
    email: string;
    name: string;
    password: string;
    phone: string;
    avatar: string | null;
}

interface AuthContextData {
    user: User;
    formState: 'signIn' | 'signUp' | 'forgot';
    loading: boolean;
    socialAuthenticationError: string | null;
    signIn: (credentials: SignInCredentials) => Promise<void>;
    signOut: () => void;
    updateUser: (user: User) => void;
    handleToSignUp: () => void;
    handleToSignIn: () => void;
    handleToForgotPassword: () => void;
    signInGoogle: () => void;
    signInFacebook: () => void;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }) => {
    const [authData, setAuthData] = useState<AuthState>({} as AuthState);
    const [loading, setLoading] = useState(true);
    const [formState, setFormState] = useState<'signIn' | 'signUp' | 'forgot'>('signIn');
    const [socialAuthenticationError, setSocialAuthenticationError] = useState<string | null>(null);

    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('@LovePetsBeta:token');
        const user = localStorage.getItem('@LovePetsBeta:user');

        const { ['@LovePetsBeta:token']: tokenCookie } = parseCookies();

        if (token && user && tokenCookie) {
            api.defaults.headers.authorization = `Bearer ${token}`;
            setAuthData({ token, user: JSON.parse(user) });
        } else {
            api.defaults.headers.authorization = null;
            setAuthData({ token: null, user: null });
        }
    }, []);

    useEffect(() => {
        if (authData.user !== undefined || authData.user === null) {
            setLoading(false);
        }
    }, [authData.user])

    const signIn = useCallback(async ({ email, password }) => {
        const response = await api.post('sessions', {
            email,
            password,
        })

        const { token, user } = response.data;

        localStorage.setItem('@LovePetsBeta:token', token);
        localStorage.setItem('@LovePetsBeta:user', JSON.stringify(user));

        setCookie(undefined, '@LovePetsBeta:token', token, {
            maxAge: 60 * 60 * 60 * 1,
            path: '/',
        })

        api.defaults.headers.authorization = `Bearer ${token}`;

        setAuthData({ token, user });

        return user;
    }, [])

    const signOut = useCallback(() => {
        localStorage.removeItem('@LovePetsBeta:token');
        localStorage.removeItem('@LovePetsBeta:user');

        destroyCookie(null, '@LovePetsBeta:token', {
            path: '/',
        });

        setAuthData({} as AuthState);

        router.push('/');
    }, []);

    const updateUser = useCallback(
        (user: User) => {
            setAuthData({
                token: authData.token,
                user,
            });
            localStorage.setItem('@LovePetsBeta:user', JSON.stringify(user));
        },
        [setAuthData, authData.token],
    );

    const handleToSignUp = useCallback(() => {
        setFormState('signUp');
    }, []);

    const handleToSignIn = useCallback(() => {
        setFormState('signIn');
    }, []);

    const handleToForgotPassword = useCallback(() => {
        setFormState('forgot');
    }, [])

    const createAndUpdateUser = useCallback(async (data: SignUpData) => {
        try {
            await api.post('/users', data);
        } catch (error) {
            console.log(error)
        }
        try {
            const user = await signIn({ email: data.email, password: data.password })

            if (!user.avatar) {
                const formData = {
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    avatar: data.avatar,
                }
                const response = await api.put('/profile', formData);

                updateUser(response.data);
            }
        } catch (error) {
            setSocialAuthenticationError(error.message);
        }
    }, [signIn])

    const signInGoogle = useCallback(() => {
        try {
            setLoading(true);
            return firebase
                .auth()
                .signInWithPopup(new firebase.auth.GoogleAuthProvider())
                .then((response: ResponseFirebaseProps) => {
                    const user = response.user;

                    const data: SignUpData = {
                        name: user.displayName,
                        email: user.email,
                        phone: user.phoneNumber ? user.phoneNumber : uuid(),
                        password: user.uid, //verificar se é seguro
                        avatar: user.photoURL ? user.photoURL : null,
                    }

                    createAndUpdateUser(data);
                }).catch((error) => {
                    console.log('errr' + error)
                    setSocialAuthenticationError(error.message);
                })
        } finally {
            setLoading(false);
        }
    }, [])

    const signInFacebook = useCallback(() => {
        try {
            setLoading(true);
            return firebase
                .auth()
                .signInWithPopup(new firebase.auth.FacebookAuthProvider().addScope('public_profile'))
                .then((response: ResponseFirebaseProps) => {
                    const token = response.credential.accessToken;
                    const user = response.user;

                    const data: SignUpData = {
                        name: user.displayName,
                        email: user.email,
                        phone: user.phoneNumber ? user.phoneNumber : uuid(),
                        password: user.uid, //verificar se é seguro
                        avatar: user.photoURL + `?type=large`,
                    }

                    createAndUpdateUser(data);
                }).catch((error) => {
                    console.log('errr' + error)
                    setSocialAuthenticationError(error.message);
                })
        } finally {
            setLoading(false);
            setSocialAuthenticationError(null);
        }
    }, [])

    return (
        <AuthContext.Provider value={{
            user: authData.user,
            loading,
            socialAuthenticationError,
            signIn,
            signOut,
            updateUser,
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


