import styles from '../../styles/Home.module.scss';
import { FormHandles } from "@unform/core"
import { useCallback, useContext, useRef } from "react"
import { AuthContext } from "../../context/AuthContext";
import { ToastContext } from "../../context/ToastContext";
import getValidationErrors from "../../utils/getValidationErrors";
import * as Yup from 'yup';
import { Form } from "@unform/web";
import Input from "../Input";
import { FiLock, FiLogIn, FiMail } from "react-icons/fi";
import Button from "../Button";

interface SignInFormData{
    email: string;
    password: string;
}

export default function FormSignIn() {
    const formRef = useRef<FormHandles>(null)
    const {signIn, handleToSignUp} = useContext(AuthContext);
    const {addToast} = useContext(ToastContext);

    const handleSubmit = useCallback(async (data : SignInFormData)=>{
        try {
          formRef.current?.setErrors({});
          const schema = Yup.object().shape({
            email: Yup.string().required('E-mail obrigatório!').email('Digite um e-mail válido'),
            password: Yup.string().required('Senha obrigatória'),
          })
    
          await schema.validate(data, {
            abortEarly: false,
          });
    
          await signIn({
            email: data.email,
            password: data.password,
          });
        } catch (error) {
          if (error instanceof Yup.ValidationError){
            const errors = getValidationErrors(error);
    
            formRef.current?.setErrors(errors);

            addToast({
              type: 'error',
              title: 'Erro na autenticação',
              message: 'Preencha todos os campos corretamente.',
            })

            return;
          }
    
          addToast({
            type: 'error',
            title: 'Erro na autenticação',
            message: 'Ocorreu um erro no login, tente novamente.',
          })
        }
      },[addToast])

    return(
        <div className={styles.formContent}>
          <img src="/logo.svg" alt="love pets" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <strong>Login</strong>

            <Input 
              name="email" 
              type="text" 
              placeholder="e-mail" 
              icon={FiMail}
            />
            <Input 
              name="password" 
              type="password" 
              placeholder="senha" 
              icon={FiLock}
            />

            <a href="#">Esqueci minha senha</a>

            <Button type="submit">
              Entrar
            </Button>

          </Form>

          <a onClick={handleToSignUp}>
            Não tem uma conta? <strong>Cadastre-se</strong>
            <FiLogIn/>
          </a>

          <Button type="button" title="google">
              <img src="/Google.svg" alt="gmail" />
              Entrar com o Gmail
          </Button>

          <Button type="button" title="facebook">
              <img src="/Facebook.svg" alt="facebook" />
              Entrar com o Facebook
          </Button>

        </div>
    )
}