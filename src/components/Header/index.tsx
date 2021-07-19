import styles from './styles.module.scss';
import { MdHome, MdFavorite, MdAccountCircle, MdPets, MdExitToApp, MdMenu, MdClose } from 'react-icons/md';
import { useContext, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';

import Link from 'next/link';

export default function Header() {
    const { signOut, user } = useContext(AuthContext);
    const menuRef = useRef<HTMLDivElement>(null);

    const toggleMobileMenu = () => {
        menuRef.current.classList.toggle(styles.menuContainerMobileOpened);
    }

    return (
        <div className={styles.container}>
            <div className={styles.logoContainer}>
                <img src="/logoW.svg" alt="love pets" />

                {user &&
                    <div>
                        <p>Bem vindo,</p>
                        <strong>
                            {user.name}
                        </strong>
                    </div>
                }
            </div>
            <div className={styles.menuContainer} ref={menuRef}>
                <Link href="/home">
                    <a>
                        <MdHome size={25} />
                        <span>Home</span>
                    </a>
                </Link>
                {user ?
                    <>
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
                    </>
                    :
                    <Link href="/">
                        <a>
                            <p>Entre ou cadastre-se</p>
                            <MdExitToApp size={25} />
                        </a>
                    </Link>
                }
                <div className={styles.closeMenu}>
                    <button onClick={toggleMobileMenu}>
                        <MdClose size={50} />
                    </button>
                </div>
            </div>
            <div className={styles.menuIcon}>
                <button onClick={toggleMobileMenu}>
                    <MdMenu size={25} />
                </button>
            </div>
        </div>
    )
}