import {createContext, useCallback, useEffect, useState} from 'react';
import { uuid } from 'uuidv4';

import ToastContainer from '../components/Toast';

export interface ToastMessage{
    id:string;
    type?: 'success' | 'error' | 'info';
    title: string;
    message: string;
}

interface ToastContextData{
    addToast: (toastMessage : Omit<ToastMessage, 'id'>) => void;
    removeToast: (id:string) => void;
}

export const ToastContext = createContext<ToastContextData>({} as ToastContextData);

export const ToastProvider = ({children}) => {
    const [toastMessages, setToastMessages] = useState<ToastMessage[]>([]);

    const addToast = useCallback(({type, title, message}: Omit<ToastMessage, 'id'>) => {
        const id = uuid();

        const toast = {
            id,
            type,
            title,
            message,
        }

        setToastMessages((oldToastMessages) => [...oldToastMessages, toast]);
    },[])

    const removeToast = useCallback((id: string) =>{
        setToastMessages((oldToastMessages) => oldToastMessages.filter((toast) => toast.id !== id));
    },[])

    return(
        <ToastContext.Provider value={{
            addToast,
            removeToast,
        }}>
            {children}
            <ToastContainer toastMessages={toastMessages}/>
        </ToastContext.Provider>
    )
}
