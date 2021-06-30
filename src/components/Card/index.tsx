import styles from './style.module.scss';
import {
    IoMdFemale,
    IoMdMale,
    IoMdHeartEmpty,
    IoMdShare,
    IoMdAlert,
    IoLogoWhatsapp,
    IoIosArrowDroprightCircle,
    IoIosArrowDropleftCircle,
} from 'react-icons/io';

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
}

export default function Card({ pet }: CardProps) {

    return (
        <div className={styles.card}>
            <header>
                <span>{pet.age}</span>
                <strong>{pet.name}</strong>
                {pet.gender === 'female' ?
                    <IoMdFemale size={25} color="#ED9090" />
                    :
                    <IoMdMale size={25} color="#129CBA" />
                }
            </header>
            <div className={styles.imageContainer}>
                <button className={styles.buttonPrev}>
                    <IoIosArrowDropleftCircle size={25} color="#797979" />
                </button>
                {pet.images.map(image => {
                    return (
                        <img src={image.image_url} alt="pet" key={image.id} />
                    )
                })}
                <button className={styles.buttonNext}>
                    <IoIosArrowDroprightCircle size={25} color="#797979" />
                </button>
            </div>
            <footer>
                <div className={styles.activityContainer}>
                    <button>
                        <IoMdHeartEmpty size={25} color="#F43434" />
                    </button>

                    <div className={styles.dotsIndicators}>
                        {pet.images.map(image => (
                            <span key={image.id} />
                        ))}
                    </div>

                    <div className={styles.actionsButtonsContainer}>
                        <button>
                            <IoMdShare size={25} color="#12BABA" />
                        </button>
                        <button>
                            <IoMdAlert size={25} color="#12BABA" />
                        </button>
                    </div>
                </div>
                <div className={styles.descriptionContainer}>
                    <p>
                        {pet.description}
                    </p>
                </div>
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
            </footer>
        </div>
    )
}