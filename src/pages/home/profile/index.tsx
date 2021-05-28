import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import Header from "../../../components/Header";
import { AuthContext } from "../../../context/AuthContext";
import { MdEmail, MdPhone} from 'react-icons/md';

import styles from './styles.module.scss';

export default function Profile() {
    const { user, loading } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        console.log(user)
        if (!loading && !user) {
            router.push('/');
        }
    }, [user, loading]);

    if(loading || !user){
        return null
    }

    return (
        <div className={styles.container}>
            <Header/>
            <div className={styles.profileContent}>
                <a href="">Editar perfil</a>

                <div className={styles.imageContainer}>
                    <img src="/profile.png" alt="avatar" />
                </div>

                <div className={styles.linksContainer}>
                    <a href="">Meus Anúncios</a>
                    <a href="">Meus Favoritos</a>
                    <a href="">Excluir conta</a>
                </div>

                <div className={styles.userInformations}>
                    <div className={styles.nameContainer}>
                        <strong>Fulano da Silva</strong>
                        <p>Brasília-DF</p>
                    </div>

                    <div className={styles.infosContainer}>
                        <span>
                            <MdEmail size={30}/>
                            <p>fulano@gmail.com</p>
                        </span>
                        <span>
                            <MdPhone size={30}/>
                            <p>(61) 999999999</p>
                        </span>
                    </div>
                </div>
            </div>

        </div>
    )
}