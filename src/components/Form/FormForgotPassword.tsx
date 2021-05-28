import styles from '../../styles/Home.module.scss';
import { FormHandles } from "@unform/core"
import { useCallback, useContext, useRef, useState } from "react"
import { AuthContext } from "../../context/AuthContext";
import { ToastContext } from "../../context/ToastContext";
import getValidationErrors from "../../utils/getValidationErrors";
import * as Yup from 'yup';
import { Form } from "@unform/web";
import Input from "../Input";
import { FiLogIn, FiMail } from "react-icons/fi";
import Button from "../Button";
import api from '../../services/api';

interface SignInFormData{
    email: string;
}

export default function FormForgotPassword() {
    const formRef = useRef<FormHandles>(null)
    const [loading, setLoading] = useState(false);
    const {handleToSignIn} = useContext(AuthContext);
    const {addToast} = useContext(ToastContext);

    const handleSubmit = useCallback(async (data : SignInFormData)=>{
        try {
          setLoading(true);
          formRef.current?.setErrors({});
          const schema = Yup.object().shape({
            email: Yup.string().required('E-mail obrigatório!').email('Digite um e-mail válido'),
          })
    
          await schema.validate(data, {
            abortEarly: false,
          });
    
          //recupera
          await api.post('/password/forgot', {
            email: data.email,
          })

          addToast({
            type: 'success',
            title: 'E-mail de recuperação enviado',
            message: 'E-mail de recuperação de senha enviado, cheque sua caixa de entrada.'
          });
        } catch (error) {
          if (error instanceof Yup.ValidationError){
            const errors = getValidationErrors(error);
    
            formRef.current?.setErrors(errors);

            addToast({
              type: 'error',
              title: 'Erro na recuperação da senha',
              message: 'Preencha todos os campos corretamente.',
            })

            return;
          }
    
          addToast({
            type: 'error',
            title: 'Erro na recuperação da senha',
            message: 'Ocorreu um erro na recuperação da senha, tente novamente.',
          })
        }finally{
          setLoading(false);
        }
      },[addToast])

    return(
        <div className={styles.formContent}>
          <img src="/logo.svg" alt="love pets" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <strong>Recuperar senha</strong>

            <Input 
              name="email" 
              type="text" 
              placeholder="e-mail" 
              icon={FiMail}
            />

            <div className={styles.buttonContainer}>
              <Button loading={loading} type="submit">
                Recuperar
              </Button>
            </div>

          </Form>

          <a onClick={handleToSignIn}>
            Voltar para <strong>Login</strong>
            <FiLogIn/>
          </a>
        </div>
    )
}