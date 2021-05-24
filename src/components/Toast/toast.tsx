import styles from './style.module.scss';
import {FiXCircle, FiAlertCircle, FiInfo, FiCheckCircle} from 'react-icons/fi';
import { ToastContext, ToastMessage } from '../../context/ToastContext';
import { useContext, useEffect } from 'react';
import {animated} from 'react-spring';

interface ToastProps{
    toastMessage: ToastMessage;
    style: object;
}

const icons = {
    info: <FiInfo size={24}/>,
    error: <FiAlertCircle size={24}/>,
    success: <FiCheckCircle size={24}/>,
}

const toastStyle = {
    info: {
        background: '#ebf8ff',
        color: '#3172b7',
    },
    error: {
        background: '#fddede',
        color: '#c53030',
    },
    success:{
        background: '#e6fffa',
        color: '#2e656a',
    }
}

export default function Toast({toastMessage, style}: ToastProps) {
    const {removeToast} = useContext(ToastContext);

    useEffect(() =>{
        const timer = setTimeout(() =>{
            removeToast(toastMessage.id);
        }, 3000);

        return () => {
            clearTimeout(timer);
        }

    },[removeToast, toastMessage.id])

    return(
        <animated.div 
            key={toastMessage.id} 
            className={styles.toast} 
            style={{...toastStyle[toastMessage.type || 'info'], ...style}}
        >
            {icons[toastMessage.type || 'info']}

            <div>
                <strong>{toastMessage.title}</strong>
                <p>{toastMessage.message}</p>
            </div>

            <button type="button" onClick={() => removeToast(toastMessage.id)}>
                <FiXCircle size={18}/>
            </button>
        </animated.div>
    )
}