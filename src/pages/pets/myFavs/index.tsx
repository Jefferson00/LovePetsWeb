import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import Card from "../../../components/Card";
import Header from "../../../components/Header";
import { api, getAPIClient } from "../../../services/api";
import { parseCookies } from "nookies";
import getDistanceLocation from "../../../utils/getDistanceLocation";
import getDistanceTime from "../../../utils/getDistanceTime";
import styles from './styles.module.scss';

interface HomeProps {
  favs: FavsData[];
}

interface FavsData {
  id: string;
  user_id: string;
  pet_id: string;
  pet: Pets;
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

export default function MyFavs(props: HomeProps) {
  const [myFavs, setMyFavs] = useState<FavsData[]>([]);

  const handleDeleteFavPet = async (id: string) => {
    try {
      await api.delete(`favs/${id}`);

      setMyFavs(myFavs.filter(favs => favs.id !== id));

    } catch (error) {
    }
  }

  useEffect(() => {
    setMyFavs(props.favs);
  }, [props.favs]);

  return (
    <div>
      <Header />
      <div className={styles.homeContainer}>
        {myFavs.map(fav => {

          return (
            <Card key={fav.id}
              pet={fav.pet}
              fav={fav}
              onDelete={handleDeleteFavPet}
            />
          )
        })}
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  let petsArr: FavsData[] = [];
  const apiClient = getAPIClient(context);

  const { ['@LovePetsBeta:token']: token } = parseCookies(context);

  if (!token) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  const setPetImages = async (petsArr: FavsData[]): Promise<FavsData[]> => {
    const mapPromises = petsArr.map(async (fav) => {
      let petsWithImages = Object.assign({}, fav)
      petsWithImages.pet.images = await findPetImages(fav.pet.id);
      petsWithImages.pet.distanceLocation = getDistanceLocation({
        fromLat: '-15.778189',
        fromLon: '-48.139945',
        toLat: fav.pet.location_lat,
        toLon: fav.pet.location_lon,
      });
      petsWithImages.pet.distanceTime = getDistanceTime(fav.pet.created_at);

      return petsWithImages;
    });
    return await Promise.all(mapPromises);
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

  const { data } = await apiClient.get('/favs');

  petsArr = data;
  petsArr = await setPetImages(petsArr);

  return {
    props: {
      favs: petsArr
    }
  }
}