import styles from './styles.module.scss';
import { MdHome, MdFavorite, MdAccountCircle, MdPets, MdExitToApp } from 'react-icons/md';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

import Link from 'next/link';

export default function Header() {
    const { signOut, user } = useContext(AuthContext);
    return (
        <div className={styles.container}>
            <div className={styles.logoContainer}>
                <img src="/logoW.svg" alt="love pets" />

                <div>
                    <p>Bem vindo,</p>
                    <strong>
                        {user.name}
                    </strong>
                </div>
            </div>
            <div className={styles.menuContainer}>
                <Link href="/home">
                    <a>
                        <MdHome size={25} />
                        <span>Home</span>
                    </a>
                </Link>
                <Link href="/pets/myFavs">
                    <a>
                        <MdFavorite size={25} />
                        <span>Favoritos</span>
                    </a>
                </Link>
                <Link href="/home/profile">
                    <a>
                        <MdAccountCircle size={25} />
                        <span>Perfil</span>
                    </a>
                </Link>
                <Link href="/pets/myPets">
                    <a>
                        <MdPets size={25} />
                        <span>Anúncios</span>
                    </a>
                </Link>
                <a onClick={signOut}>
                    <MdExitToApp size={25} />
                    <span>Sair</span>
                </a>
            </div>
        </div>
    )
}