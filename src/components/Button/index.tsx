import { ButtonHTMLAttributes } from 'react';
import styles from './style.module.scss';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export default function Button({children, ...rest} : ButtonProps) {

    return(
        <button className={styles.container} {...rest} >
           {children}
        </button>
    )
}