import styles from './styles/FormUpdateProfile.module.scss';
import { useCallback, useContext, useRef } from "react";

import { FormHandles } from "@unform/core"
import * as Yup from 'yup';
import { Form } from "@unform/web";
import { FiLock, FiMail, FiUser, FiPhone } from "react-icons/fi";


import getValidationErrors from "../../utils/getValidationErrors";
import { ToastContext } from "../../context/ToastContext";
import { AuthContext } from "../../context/AuthContext";
import Input from "../Input";
import Button from "../Button";
import { api } from '../../services/api';
import { useRouter } from 'next/router';
import { isUuid } from 'uuidv4';

interface SignUpFormData {
  email: string;
  name: string;
  old_password: string;
  password: string;
  confirmPassword: string;
  phone: string;
}

export default function FormUpdateProfile() {
  const formRef = useRef<FormHandles>(null);

  const router = useRouter();

  const { updateUser, user } = useContext(AuthContext);

  const { addToast } = useContext(ToastContext);

  const handleSubmit = useCallback(async (data: SignUpFormData) => {
    try {
      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        email: Yup.string().required('E-mail obrigatório!').email('Digite um e-mail válido'),
        name: Yup.string().required('Nome é obrigatório!'),
        old_password: Yup.string(),
        password: Yup.string().when('old_password', {
          is: oldPass => !!oldPass.length,
          then: Yup.string().required('Campo obrigatório'),
          otherwise: Yup.string(),
        }),
        confirmPassword: Yup.string().when('old_password', {
          is: oldPass => !!oldPass.length,
          then: Yup.string().required('Campo obrigatório'),
          otherwise: Yup.string(),
        }).equals(
          [Yup.ref('password')], 'a senha deve ser igual'),
        phone: Yup.string().required('Telefone é obrigatório!'),
      })

      await schema.validate(data, {
        abortEarly: false,
      });

      const { name, phone, email, confirmPassword, old_password, password } = data;

      const formData = Object.assign({
        name,
        email,
        phone,
      }, old_password ? {
        old_password,
        password,
        confirmPassword,
      } : {});

      const response = await api.put('/profile', formData);

      updateUser(response.data);

      router.push('/home');

      addToast({
        type: 'success',
        title: 'Perfil atualizado!',
        message: 'Perfil atualizado com sucesso!'
      });

    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const errors = getValidationErrors(error);

        formRef.current?.setErrors(errors);

        addToast({
          type: 'error',
          title: 'Erro na atualização',
          message: 'Preencha todos os campos corretamente.',
        })

        return;
      }

      addToast({
        type: 'error',
        title: 'Erro na atualização',
        message: 'Ocorreu um erro na atualização dos dados, tente novamente.',
      })
    }
  }, [addToast])


  return (
    <div className={styles.formContent}>
      <Form
        initialData={{
          email: user.email,
          name: user.name,
          phone: isUuid(user.phone) ? '' : user.phone,
        }}
        ref={formRef}
        onSubmit={handleSubmit}>

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
          name="old_password"
          type="password"
          placeholder="senha atual"
          icon={FiLock}
        />

        <Input
          name="password"
          type="password"
          placeholder="nova senha"
          icon={FiLock}
        />

        <Input
          name="confirmPassword"
          type="password"
          placeholder="confirmar senha nova senha"
          icon={FiLock}
        />

        <Input
          name="phone"
          type="text"
          placeholder="(00) 0000-0000"
          icon={FiPhone}
        />

        <div className={styles.buttonContainer}>
          <Button type="submit">
            Atualizar
          </Button>
        </div>

      </Form>

    </div>
  )
}