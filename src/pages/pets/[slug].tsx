import { GetServerSideProps } from "next"
import Head from 'next/head';
import { getAPIClient } from "../../services/api";

import getDistanceLocation from "../../utils/getDistanceLocation";
import getDistanceTime from "../../utils/getDistanceTime";

import Card from "../../components/Card";
import Header from "../../components/Header";

import styles from './styles.module.scss';

interface PetsProps {
  pets: Pets;
}

interface Pets {
  id: string;
  name: string;
  user_id: string;
  species: Specie;
  is_adopt: boolean;
  age: Age;
  gender: Gender;
  description: string;
  location_lat: string;
  location_lon: string;
  city: string;
  state: string;
  distanceLocation: number;
  distanceTime: string;
  created_at: Date;
  updated_at: Date;
  user_name: string;
  user_phone: string;
  user_avatar: string;
  images: IPetImages[];
}

interface IPetImages {
  id: string | null;
  pet_id: string;
  image: string;
  image_url: string | null;
}

type Specie = 'dog' | 'cat' | 'rodent' | 'rabbit' | 'fish' | 'others';
type Age = '- 1 ano' | '1 ano' | '2 anos' | '3 anos' | '4 anos' | '+ 4 anos';
type Gender = 'male' | 'female';

export default function Pets(props: PetsProps) {

  return (
    <div>
      <Head>
        <title>LovePets Amor aos animais</title>
      </Head>
      <Header />
      <div className={styles.container}>
        <Card
          pet={props.pets}
        />
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params;
  let pets: Pets;
  const apiClient = getAPIClient(context);

  const setPetImages = async (pets: Pets): Promise<Pets> => {
    let petsWithImages = Object.assign({}, pets)
    petsWithImages.images = await findPetImages(pets.id);
    petsWithImages.distanceLocation = getDistanceLocation({
      fromLat: '-15.778189',
      fromLon: '-48.139945',
      toLat: pets.location_lat,
      toLon: pets.location_lon,
    });
    petsWithImages.distanceTime = getDistanceTime(pets.created_at);

    return petsWithImages;
  }

  const findPetImages = async (pet_id: string): Promise<IPetImages[]> => {
    let images: IPetImages[] = []
    try {
      const response = await apiClient.get(`/images/${pet_id}`)
      images = response.data;
    } catch (error) {
    }
    return images;
  }

  const { data } = await apiClient.get(`/pets/find/${slug}`);

  pets = data;
  pets = await setPetImages(pets);

  return {
    props: {
      pets
    }
  }
}