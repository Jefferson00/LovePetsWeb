import styles from './styles.module.scss';

import { FormHandles } from '@unform/core';
import { useCallback, useContext, useRef } from 'react';
import * as Yup from 'yup';
import { Form } from "@unform/web";
import { FiLock } from "react-icons/fi";
import { api } from '../../services/api';
import { ToastContext } from '../../context/ToastContext';
import getValidationErrors from '../../utils/getValidationErrors';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useRouter } from 'next/router';

interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

export default function ResetPassword() {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useContext(ToastContext);

  const router = useRouter();

  const handleSubmit = useCallback(async (data: ResetPasswordFormData) => {
    try {
      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        password: Yup.string().required('Senha obrigatória!'),
        confirmPassword: Yup.string().required('Senha obrigatória').equals(
          [Yup.ref('password')], 'a senha deve ser igual'),
      })

      await schema.validate(data, {
        abortEarly: false,
      });

      const token = router.query.token

      console.log(token)

      if (!token) {
        addToast({
          type: 'error',
          title: 'Erro ao definir nova senha',
          message: 'Token não válido',
        });

        return;
      }

      await api.post('/password/reset', {
        password: data.password,
        confirmPassword: data.confirmPassword,
        token,
      });

      addToast({
        type: 'success',
        title: 'Senha definida com sucesso',
        message: 'Sua nova senha foi definida com sucesso!'
      });

      router.push('/');
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const errors = getValidationErrors(error);

        formRef.current?.setErrors(errors);

        addToast({
          type: 'error',
          title: 'Erro ao definir nova senha',
          message: 'Preencha todos os campos corretamente.',
        })

        return;
      }

      addToast({
        type: 'error',
        title: 'Erro ao definir nova senha',
        message: 'Ocorreu um erro ao definir nova senha, tente novamente',
      })
    }
  }, [addToast, router])

  return (
    <div className={styles.container}>

      <div className={styles.formContent}>
        <img src="/logo.svg" alt="love pets" />

        <Form ref={formRef} onSubmit={handleSubmit}>
          <div className={styles.labelContainer}>
            <strong>Definir nova senha</strong>
          </div>
          <Input
            name="password"
            type="password"
            placeholder="nova senha"
            icon={FiLock}
          />

          <Input
            name="confirmPassword"
            type="password"
            placeholder="confirmar nova senha"
            icon={FiLock}
          />

          <div className={styles.buttonContainer}>
            <Button type="submit">
              Definir nova senha
            </Button>
          </div>

        </Form>
      </div>
    </div>
  )
}