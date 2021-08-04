import Link from 'next/link';
import Head from 'next/head';
import { ChangeEvent, useCallback, useContext, useState } from "react";
import Header from "../../../components/Header";
import { AuthContext } from "../../../context/AuthContext";
import { MdEmail, MdPhone, MdEdit, MdCameraAlt, MdCancel } from 'react-icons/md';

import styles from './styles.module.scss';
import { api } from "../../../services/api";
import { ToastContext } from "../../../context/ToastContext";
import FormUpdateProfile from "../../../components/Form/FormUpdateProfile";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { isUuid } from "uuidv4";
import firebase from '../../../lib/firebase';

export default function Profile() {
    const { user, updateUser, signOut } = useContext(AuthContext);
    const { addToast } = useContext(ToastContext);

    const [isUpdating, setIsUpdating] = useState(false);

    const handleUpdateAvatar = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const data = new FormData();

            data.append('avatar', e.target.files[0]);

            api.patch('/users/avatar', data).then(response => {
                updateUser(response.data);
                addToast({
                    type: 'success',
                    title: 'Avatar atualizado',
                    message: 'Avatar atualizado com sucesso',
                });
            });
        }
    }, [addToast]);

    const handleDeleteAccount = useCallback(async () => {
        if (confirm('Deseja realmente excluir?')) {
            try {
                await api.delete('users');
                await firebase.auth().currentUser.delete();
                signOut();
            } catch (error) {
                console.log(error)
            }
        }
    }, []);



    return (
        <div className={styles.container}>
            <Head>
                <title>Perfil | LovePets Amor aos animais</title>
            </Head>
            <Header />
            <div className={styles.profileContent}>
                <a onClick={() => setIsUpdating(!isUpdating)}>
                    {isUpdating ?
                        <>
                            <MdCancel size={20} />
                            Cancelar
                        </>
                        :
                        <>
                            <MdEdit size={20} />
                            Editar perfil
                        </>
                    }
                </a>

                <div className={styles.imageContainer}>
                    {!user?.avatar_url ?
                        <img src="/profile.png" alt="avatar" />
                        :
                        <img src={user.avatar_url} alt="avatar" />
                    }
                    <label htmlFor="avatar">
                        <MdCameraAlt size={20} color="#fff" />
                        <input type="file" id="avatar" onChange={handleUpdateAvatar} />
                    </label>
                </div>

                <div className={styles.linksContainer}>
                    <Link href="/pets/myPets">
                        <a>Meus Anúncios</a>
                    </Link>
                    <Link href="/pets/myFavs">
                        <a>Meus Favoritos</a>
                    </Link>
                    <a onClick={handleDeleteAccount}>Excluir conta</a>
                </div>

                {isUpdating ?
                    <FormUpdateProfile />
                    :
                    <div className={styles.userInformations}>
                        <div className={styles.nameContainer}>
                            <strong>{user?.name}</strong>
                            <p>Brasília-DF</p>
                        </div>

                        <div className={styles.infosContainer}>
                            <span>
                                <MdEmail size={30} />
                                <p>{user?.email}</p>
                            </span>
                            <span>
                                <MdPhone size={30} />
                                <p>{isUuid(user?.phone) ? '' : user?.phone}</p>
                            </span>
                        </div>
                    </div>
                }
            </div>

        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {

    const { ['@LovePetsBeta:token']: token } = parseCookies(context);

    if (!token) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            }
        }
    }

    return {
        props: {

        }
    }
}