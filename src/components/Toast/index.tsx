import styles from './style.module.scss';
import {useTransition} from 'react-spring';

import { ToastMessage } from '../../context/ToastContext';

import Toast from './toast'

interface ToastProps{
    toastMessages : ToastMessage[];
}

export default function ToastContainer({toastMessages}: ToastProps) {
    const toastMessagensWithTransitions = useTransition(
        toastMessages,
        {
            keys: toast => toast.id,
            
            from: { right: '-120%'},
            enter: {right: '0%'},
            leave: {right: '-120%'},
        },

    );

    const fragment = toastMessagensWithTransitions((style, item) => {
        return <Toast style={style} toastMessage={item}/>
    })

    return(
        <div className={styles.container}>
            {fragment}
        </div>
    )

}