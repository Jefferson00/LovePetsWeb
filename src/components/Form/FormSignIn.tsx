import styles from '../../styles/Home.module.scss';
import { FormHandles } from "@unform/core"
import { useCallback, useContext, useEffect, useRef, useState } from "react"
import { AuthContext } from "../../context/AuthContext";
import { ToastContext } from "../../context/ToastContext";
import getValidationErrors from "../../utils/getValidationErrors";
import * as Yup from 'yup';
import { Form } from "@unform/web";
import Input from "../Input";
import { FiLock, FiLogIn, FiMail } from "react-icons/fi";
import Button from "../Button";

interface SignInFormData {
  email: string;
  password: string;
}

export default function FormSignIn() {
  const formRef = useRef<FormHandles>(null);
  const [loading, setLoading] = useState(false);
  const {
    signIn,
    handleToSignUp,
    handleToForgotPassword,
    signInGoogle,
    signInFacebook,
    socialAuthenticationError,
  } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);

  const handleSubmit = useCallback(async (data: SignInFormData) => {
    setLoading(true);
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

      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error instanceof Yup.ValidationError) {
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
  }, [addToast]);

  const handleLoginGoogle = useCallback(() => {
    setLoading(true);
    signInGoogle();
  }, [signInGoogle]);

  const handleLoginFacebook = useCallback(() => {
    setLoading(true);
    signInFacebook();
  }, [signInFacebook]);

  useEffect(() => {
    if (socialAuthenticationError) {
      addToast({
        type: 'error',
        title: 'Erro na autenticação',
        message: socialAuthenticationError,
      });
      setLoading(false);
    }
  }, [socialAuthenticationError]);

  return (
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

        <a onClick={handleToForgotPassword}>Esqueci minha senha</a>

        <Button type="submit">
          Entrar
        </Button>

      </Form>

      <a onClick={handleToSignUp}>
        Não tem uma conta? <strong>Cadastre-se</strong>
        <FiLogIn />
      </a>

      <Button type="button" title="google" onClick={handleLoginGoogle}>
        <img src="/Google.svg" alt="gmail" />
        Entrar com o Gmail
      </Button>

      <Button type="button" title="facebook" onClick={handleLoginFacebook}>
        <img src="/Facebook.svg" alt="facebook" />
        Entrar com o Facebook
      </Button>

      {loading &&
        <div className={styles.loadingModalContainer}>
          <img src="/loading-cat.gif" alt="carregando" />
        </div>
      }

    </div>
  )
}