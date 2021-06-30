import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import Card from "../../components/Card";
import Header from "../../components/Header";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";
import getDistanceLocation from "../../utils/getDistanceLocation";
import getDistanceTime from "../../utils/getDistanceTime";
import styles from './styles.module.scss';

interface HomeProps {
    pets: Pets[];
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

export default function Home(props: HomeProps) {
    const { user, loading } = useContext(AuthContext);
    const [pets, setPets] = useState<Pets[]>([]);
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/');
        }
    }, [user]);

    useEffect(() => {
        setPets(props.pets);
    }, [props.pets]);

    if (loading || !user) {
        return null
    }

    return (
        <div>
            <Header />
            <div className={styles.homeContainer}>
                {pets.map(pet => {

                    return (
                        <Card key={pet.id}
                            pet={pet}
                        />
                    )
                })}
            </div>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    let petsArr: Pets[] = [];

    const setPetImages = async (petsArr: Pets[]): Promise<Pets[]> => {
        const mapPromises = petsArr.map(async (pet) => {
            let petsWithImages = Object.assign({}, pet)
            petsWithImages.images = await findPetImages(pet.id);
            petsWithImages.distanceLocation = getDistanceLocation({
                fromLat: '-15.778189',
                fromLon: '-48.139945',
                toLat: pet.location_lat,
                toLon: pet.location_lon,
            });
            petsWithImages.distanceTime = getDistanceTime(pet.created_at);

            return petsWithImages;
        });
        return await Promise.all(mapPromises);
    }

    const findPetImages = async (pet_id: string): Promise<IPetImages[]> => {
        let images: IPetImages[] = []
        try {
            const response = await api.get(`/images/${pet_id}`)
            images = response.data;
        } catch (error) {
        }
        return images;
    }

    const { data } = await api.get('/pets', {
        params: {
            location_lat: '-15.778189',
            location_lon: '-48.139945',
            distance: '50',
            species: undefined,
            gender: undefined,
            limit: 5,
            skip: 1,
        }
    });

    petsArr = data;
    petsArr = await setPetImages(petsArr);



    return {
        props: {
            pets: petsArr
        }
    }
}