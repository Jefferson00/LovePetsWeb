import styles from './style.module.scss';
import {
    IoMdFemale,
    IoMdMale,
    IoMdHeartEmpty,
    IoMdHeart,
    IoMdShare,
    IoMdAlert,
    IoLogoWhatsapp,
    IoIosArrowDroprightCircle,
    IoIosArrowDropleftCircle,
} from 'react-icons/io';
import { useCallback, useEffect, useRef, useState } from 'react';


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
    distanceLocation: number;
    distanceTime: string;
    city: string;
    state: string;
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

interface CardProps {
    pet: Pets;
    fav?: FavsData;
    itsMyPet?: boolean;
    onDelete?: (id: string) => Promise<void>;
    toggleFav?: (pets_id: string) => Promise<void>;
}

export default function Card({ pet, itsMyPet, fav, onDelete, toggleFav }: CardProps) {
    const imageContainer = useRef(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const images = imageContainer.current.querySelectorAll('img');

        images[currentImageIndex].style.opacity = 1;
    }, [])

    const handlePrevImage = useCallback(() => {
        const images = imageContainer.current.querySelectorAll('img');
        const length = images.length;
        setCurrentImageIndex(currentImageIndex - 1);

        if (currentImageIndex - 1 < 0) {
            setCurrentImageIndex(0);
        } else {
            let translateRate = (currentImageIndex - 1) * 100;
            //images[currentImageIndex].style.transform = `initial`;
            images[currentImageIndex].style.opacity = 0;

            //images[currentImageIndex - 1].style.transform = `translateX(0)`;
            images[currentImageIndex - 1].style.opacity = 1;
        }
    }, [imageContainer.current, currentImageIndex]);

    const handleNextImage = useCallback(() => {
        const images = imageContainer.current.querySelectorAll('img');
        const length = images.length;
        setCurrentImageIndex(currentImageIndex + 1);

        if (currentImageIndex + 1 >= length) {
            setCurrentImageIndex(length - 1);
        } else {
            let translateRate = (currentImageIndex + 1) * 100;
            //images[currentImageIndex].style.transform = `translateX(-${translateRate}%)`;
            images[currentImageIndex].style.opacity = 0;

            //images[currentImageIndex + 1].style.transform = `translateX(-${translateRate}%)`;
            images[currentImageIndex + 1].style.opacity = 1;
        }
    }, [imageContainer.current, currentImageIndex]);

    return (
        <div className={styles.card} key={pet.id}>
            <header>
                <span>{pet.age}</span>
                <strong>{pet.name}</strong>
                {pet.gender === 'female' ?
                    <IoMdFemale size={25} color="#ED9090" />
                    :
                    <IoMdMale size={25} color="#129CBA" />
                }
            </header>
            <div className={styles.imageContainer} ref={imageContainer}>
                {(pet.images.length > 1 && currentImageIndex > 0) &&
                    <button className={styles.buttonPrev} onClick={handlePrevImage}>
                        <IoIosArrowDropleftCircle size={25} color="#797979" />
                    </button>
                }
                {pet.images.map(image => {
                    return (
                        <img src={image.image_url} alt="pet" key={image.id} />
                    )
                })}
                {(pet.images.length > 1 && (currentImageIndex + 1) < pet.images.length) &&
                    <button className={styles.buttonNext} onClick={handleNextImage}>
                        <IoIosArrowDroprightCircle size={25} color="#797979" />
                    </button>
                }
            </div>
            <footer>
                <div className={styles.activityContainer}>
                    {!itsMyPet &&
                        fav ?
                        <button onClick={() => onDelete(fav.id)}>
                            <IoMdHeart size={25} color="#F43434" />
                        </button>
                        :
                        <button onClick={() => toggleFav(pet.id)}>
                            <IoMdHeartEmpty size={25} color="#F43434" />
                        </button>
                    }

                    <div className={styles.dotsIndicators}>
                        {pet.images.map((image, index) => {
                            if (index === currentImageIndex) {
                                return (
                                    <span key={image.id} style={{ background: '#12BABA' }} />
                                )
                            } else {
                                return (
                                    <span key={image.id} />
                                )
                            }
                        })}
                    </div>

                    <div className={styles.actionsButtonsContainer}>
                        <button>
                            <IoMdShare size={25} color="#12BABA" />
                        </button>
                        {!itsMyPet &&
                            <button>
                                <IoMdAlert size={25} color="#12BABA" />
                            </button>
                        }
                    </div>
                </div>
                <div className={styles.descriptionContainer}>
                    <p>
                        {pet.description}
                    </p>
                </div>

                {!itsMyPet ?
                    <>
                        <h4>Entrar em contato:</h4>
                        <div className={styles.contactContainer}>
                            <div className={styles.userInfo}>
                                <img src={pet.user_avatar} alt="avatar" />
                                <span>{pet.user_name}</span>
                                <button>
                                    <IoLogoWhatsapp size={40} color="#4EC953" />
                                </button>
                            </div>

                            <div className={styles.locationInfoContainer}>
                                <span>{pet.distanceLocation} km</span>
                                <span>{pet.distanceTime}</span>
                            </div>
                        </div>
                    </>
                    :
                    <div className={styles.distanceTimeContainer}>
                        <span>{pet.distanceTime}</span>
                    </div>
                }
            </footer>
        </div>
    )
}