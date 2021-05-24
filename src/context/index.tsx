import { AuthProvider } from "./AuthContext"
import { ToastProvider } from "./ToastContext"


export const AppProvider = ({children, ...rest}) => {

    return(
        <AuthProvider>
            <ToastProvider>
                {children}
            </ToastProvider>
        </AuthProvider>
    )
}

