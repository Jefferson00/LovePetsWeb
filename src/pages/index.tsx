import styles from '../styles/Home.module.scss';

import FormSignIn from '../components/Form/FormSignIn';
import FormSignUp from '../components/Form/FormSignUp';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';

import { useRouter } from 'next/router';
import FormForgotPassword from '../components/Form/FormForgotPassword';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';


export default function Home() {
  const { formState, user, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/home');
    }
  }, [user]);

  return (
    <div className={styles.container}>

      <section className={styles.formContainer}>
        {formState === 'signIn' && <FormSignIn />}
        {formState === 'signUp' && <FormSignUp />}
        {formState === 'forgot' && <FormForgotPassword />}
      </section>

      <section className={styles.contentContainer}>

        <h1>Love Pets</h1>
        <p>Amor aos animais</p>

        {formState === 'signIn' && <img src="/pets.svg" alt="pets" />}
        {formState === 'forgot' && <img src="/pets.svg" alt="pets" />}
        {formState === 'signUp' && <img src="/pets2.svg" alt="pets" />}

        <div>
          <span>
            <strong>Encontre</strong>  Pets para adoção perto de você
          </span>

          <span>
            <strong>Doe</strong>  um Pet para uma nova família
          </span>
        </div>

      </section>

    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {

  const { ['@LovePetsBeta:token']: token } = parseCookies(context);

  if (token) {
    return {
      redirect: {
        destination: '/home',
        permanent: false,
      }
    }
  }

  return {
    props: {

    }
  }
}