import { ButtonHTMLAttributes } from 'react';
import styles from './style.module.scss';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    loading ?: boolean;
};

export default function Button({children, loading, ...rest} : ButtonProps) {

    return(
        <button className={styles.container} {...rest} >
           {loading ? 'Carregando...' : children}
        </button>
    )
}