import styles from '../../styles/Home.module.scss';
import { useCallback, useContext, useRef, useState } from "react";

import { FormHandles } from "@unform/core"
import * as Yup from 'yup';
import { Form } from "@unform/web";
import { FiLock, FiLogIn, FiMail, FiUser, FiPhone } from "react-icons/fi";


import getValidationErrors from "../../utils/getValidationErrors";
import { ToastContext } from "../../context/ToastContext";
import { AuthContext } from "../../context/AuthContext";
import Input from "../Input";
import Button from "../Button";
import { api } from '../../services/api';

interface SignUpFormData {
  email: string;
  name: string;
  password: string;
  phone: string;
}

export default function FormSignUp() {
  const formRef = useRef<FormHandles>(null)
  const { handleToSignIn } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(async (data: SignUpFormData) => {
    setLoading(true);
    console.log(data)
    try {
      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        email: Yup.string().required('E-mail obrigatório!').email('Digite um e-mail válido'),
        name: Yup.string().required('Nome é obrigatório!'),
        password: Yup.string().required('Senha obrigatória'),
        confirmPassword: Yup.string().required('Senha obrigatória').equals(
          [Yup.ref('password')], 'a senha deve ser igual'),
        phone: Yup.string().required('Telefone é obrigatório!'),
      })

      await schema.validate(data, {
        abortEarly: false,
      });

      await api.post('/users', data);

      setLoading(false);

      addToast({
        type: 'success',
        title: 'Cadastro realizado!',
        message: 'Cadastro realizado com sucesso!'
      });

      handleToSignIn();

    } catch (error) {
      setLoading(false);
      if (error instanceof Yup.ValidationError) {
        const errors = getValidationErrors(error);

        formRef.current?.setErrors(errors);

        addToast({
          type: 'error',
          title: 'Erro na cadastro',
          message: 'Preencha todos os campos corretamente.',
        })

        return;
      }

      addToast({
        type: 'error',
        title: 'Erro na cadastro',
        message: 'Ocorreu um erro no cadastro, tente novamente.',
      })
    }

  }, [addToast])


  return (
    <div className={styles.formContent}>
      <img src="/logo.svg" alt="love pets" />

      <Form ref={formRef} onSubmit={handleSubmit}>
        <strong>Cadastro</strong>

        <Input
          name="email"
          type="text"
          placeholder="e-mail"
          icon={FiMail}
        />

        <Input
          name="name"
          type="text"
          placeholder="nome"
          icon={FiUser}
        />

        <Input
          name="password"
          type="password"
          placeholder="senha"
          icon={FiLock}
        />

        <Input
          name="confirmPassword"
          type="password"
          placeholder="confirmar senha"
          icon={FiLock}
        />

        <Input
          name="phone"
          type="text"
          placeholder="(00) 0000-0000"
          icon={FiPhone}
          isMasked
          mask="99 99999 9999"
        />

        <div className={styles.buttonContainer}>
          <Button type="submit">
            Cadastrar
          </Button>
        </div>

      </Form>

      <a onClick={handleToSignIn}>
        Já tem uma conta? <strong>Entre</strong>
        <FiLogIn />
      </a>

      {loading &&
        <div className={styles.loadingModalContainer}>
          <img src="/loading-dog.gif" alt="carregando" />
        </div>
      }

    </div>
  )
}