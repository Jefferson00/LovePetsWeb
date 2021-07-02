import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import Card from "../../components/Card";
import Header from "../../components/Header";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../services/api";
import getDistanceLocation from "../../utils/getDistanceLocation";
import getDistanceTime from "../../utils/getDistanceTime";
import styles from './styles.module.scss';
import { setCookie, destroyCookie, parseCookies } from 'nookies';

import {
    IoIosArrowDropdownCircle,
    IoMdFemale,
    IoMdMale,
} from 'react-icons/io';
import IcPets from "../../components/Icons/IcPets";

interface HomeProps {
    pets: Pets[];
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

export default function Home(props: HomeProps) {
    const { user } = useContext(AuthContext);
    const router = useRouter();
    const [pets, setPets] = useState<Pets[]>([]);
    const [myFavs, setMyFavs] = useState<FavsData[]>([]);
    const [page, setPage] = useState(2);
    const [distance, setDistance] = useState("50");
    const [filtered, setFiltered] = useState(false);
    const [gender, setGender] = useState(null);
    const [specie, setSpecie] = useState(null);
    const [hasMoreResults, setHasMoreResults] = useState(true);

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

    const loadMorePets = async () => {
        setPage(page + 1);

        loadPets();
    }

    const handleUpdateSpecieFilter = (specieFilter: string | null) => {
        if (specie || specieFilter) {
            setPage(1);
            setFiltered(true);
            setSpecie(specieFilter);
            setPets([]);
            setHasMoreResults(true);
        }
    }

    const handleUpdateGenderFilter = (genderFilter: string | null) => {
        if (gender || genderFilter) {
            setPage(1);
            setFiltered(true);
            setPets([]);
            setHasMoreResults(true);
            setGender(genderFilter);
        }
    }

    const handleUpdateDistanceFilter = (distance: string) => {
        setPage(1);
        setFiltered(true);
        setPets([]);
        setHasMoreResults(true);
        setDistance(distance);
    }

    const loadPets = async () => {
        const { data } = await api.get('/pets', {
            params: {
                location_lat: '-15.778189',
                location_lon: '-48.139945',
                distance: distance,
                species: specie,
                gender: gender,
                limit: 5,
                skip: page,
            }
        });

        if (data.length === 0) {
            setHasMoreResults(false);
        }

        petsArr = data;
        petsArr = await setPetImages(petsArr);

        if (page > 1) {
            setPets([...pets, ...petsArr]);
        } else {
            setPets(petsArr);
        }
    }

    const loadFavs = async () => {
        const response = await api.get('/favs');

        setMyFavs(response.data);
    }

    const handleToggleFav = async (pets_id: string) => {
        if (user) {
            try {
                await api.post('/favs', { pets_id });
            } catch (error) {
                if (myFavs) {
                    const favToDelete = myFavs.find(fav => (fav.pet_id === pets_id && fav.user_id === user.id));

                    if (favToDelete) {
                        await api.delete(`/favs/${favToDelete.id}`);
                    }
                }
            }
        } else {
            alert('Entre ou crie uma conta');
        }
        loadFavs();
    }

    useEffect(() => {
        if (filtered) {
            loadPets();
        }
    }, [specie, gender, distance]);


    useEffect(() => {
        setPets(props.pets);

    }, [props.pets]);

    useEffect(() => {
        if ("geolocation" in navigator) {
            destroyCookie(null, '@LovePetsBeta:location_latitude');
            destroyCookie(null, '@LovePetsBeta:location_longitude');
            navigator.geolocation.getCurrentPosition((position) => {
                console.log(position);
                setCookie(undefined, '@LovePetsBeta:location_latitude', String(position.coords.latitude), {
                    maxAge: 60 * 60 * 60 * 1,
                });
                setCookie(undefined, '@LovePetsBeta:location_longitude', String(position.coords.longitude), {
                    maxAge: 60 * 60 * 60 * 1,
                });
            })
        } else {
            alert("Desculpe, mas o seu navegador parece não possuir geolocalização. ")
        }
        if (user) {
            loadFavs();
        }
    }, []);


    return (
        <div>
            <Header />
            <div className={styles.homeContainer}>
                {pets.map(pet => {

                    return (
                        <Card key={pet.id}
                            pet={pet}
                            toggleFav={handleToggleFav}
                            itsFav={user && myFavs.find(
                                fav => (fav.pet_id === pet.id && fav.user_id === user.id)
                            ) && true}
                        />
                    )
                })}

                <div className={styles.filterContainer}>
                    <span>Filtrar por especie</span>
                    <div className={styles.specieFilterContainer}>
                        <button onClick={() => handleUpdateSpecieFilter('dog')}>
                            <IcPets
                                size="25"
                                color={specie === 'dog' ? "#12baba" : "#c4c4c4"}
                                name="dog"
                            />
                        </button>
                        <button onClick={() => handleUpdateSpecieFilter('cat')}>
                            <IcPets
                                size="25"
                                color={specie === 'cat' ? "#12baba" : "#c4c4c4"}
                                name="cat"
                            />
                        </button>
                        <button onClick={() => handleUpdateSpecieFilter('rodent')}>
                            <IcPets
                                size="25"
                                color={specie === 'rodent' ? "#12baba" : "#c4c4c4"}
                                name="rodent"
                            />
                        </button>
                        <button onClick={() => handleUpdateSpecieFilter('rabbit')}>
                            <IcPets
                                size="25"
                                color={specie === 'rabbit' ? "#12baba" : "#c4c4c4"}
                                name="rabbit"
                            />
                        </button>
                        <button onClick={() => handleUpdateSpecieFilter('fish')}>
                            <IcPets
                                size="25"
                                color={specie === 'fish' ? "#12baba" : "#c4c4c4"}
                                name="fish"
                            />
                        </button>
                        <button onClick={() => handleUpdateSpecieFilter('others')}>
                            <IcPets
                                size="25"
                                color={specie === 'others' ? "#12baba" : "#c4c4c4"}
                                name="others"
                            />
                        </button>
                    </div>

                    <span className={styles.clearFilterButton} onClick={() => handleUpdateSpecieFilter(null)}>
                        Limpar filtro
                    </span>

                    <span>Filtrar por genêro</span>
                    <div className={styles.genderFilterContainer}>
                        <button onClick={() => handleUpdateGenderFilter('female')}>
                            <IoMdFemale
                                size="25"
                                color={gender === 'female' ? "#12baba" : "#c4c4c4"}
                            />
                        </button>
                        <button onClick={() => handleUpdateGenderFilter('male')}>
                            <IoMdMale
                                size="25"
                                color={gender === 'male' ? "#12baba" : "#c4c4c4"}
                            />
                        </button>
                        <button onClick={() => handleUpdateGenderFilter(null)}>
                            <IoMdMale
                                size="14"
                                color={!gender ? "#12baba" : "#c4c4c4"}
                            />
                            <IoMdFemale
                                size="14"
                                color={!gender ? "#12baba" : "#c4c4c4"}
                            />
                        </button>
                    </div>


                    <span>Filtrar por distância</span>
                    <div className={styles.distanceFilterContainer}>
                        <input
                            type="range"
                            name="distance"
                            id="distance"
                            min="10"
                            max="90"
                            value={distance}
                            onChange={(e) => handleUpdateDistanceFilter(e.target.value)}
                        />
                    </div>
                    <span>
                        {distance} km
                    </span>
                </div>

                <div className={styles.loadMoreContainer}>
                    {hasMoreResults ?
                        <button onClick={loadMorePets}>
                            <IoIosArrowDropdownCircle size={40} color="#12BABA" />
                        </button>
                        :
                        <h4>
                            Isso é tudo por enquanto.
                        </h4>
                    }
                </div>
            </div>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    let petsArr: Pets[] = [];

    const { ['@LovePetsBeta:location_latitude']: latitude } = parseCookies(context);
    const { ['@LovePetsBeta:location_longitude']: longitude } = parseCookies(context);

    let current_latitude = '-15.778189';
    let currrent_longitude = '-48.139945';

    if (latitude) {
        current_latitude = latitude;
    }

    if (longitude) {
        currrent_longitude = longitude;
    }

    const setPetImages = async (petsArr: Pets[]): Promise<Pets[]> => {
        const mapPromises = petsArr.map(async (pet) => {
            let petsWithImages = Object.assign({}, pet)
            petsWithImages.images = await findPetImages(pet.id);
            petsWithImages.distanceLocation = getDistanceLocation({
                fromLat: current_latitude,
                fromLon: currrent_longitude,
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
            location_lat: current_latitude,
            location_lon: currrent_longitude,
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