import styles from './style.module.scss';
import Modal from 'react-modal';
import {
    IoMdFemale,
    IoMdMale,
    IoMdHeartEmpty,
    IoMdHeart,
    IoMdShare,
    IoMdAlert,
    IoMdTrash,
    IoLogoWhatsapp,
    IoIosArrowDroprightCircle,
    IoIosArrowDropleftCircle,
} from 'react-icons/io';
import { Form } from "@unform/web";
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { RWebShare } from "react-web-share";
import { api } from '../../services/api';
import { FormHandles } from '@unform/core';
import Radio from '../Radio';
import { ToastContext } from '../../context/ToastContext';


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

type FormData = {
    denuncia: string;
};

interface CardProps {
    pet: Pets;
    fav?: FavsData;
    itsMyPet?: boolean;
    itsFav?: boolean;
    onDelete?: (id: string) => Promise<void>;
    toggleFav?: (pets_id: string) => Promise<void>;
}

export default function Card({ pet, itsMyPet, fav, itsFav, onDelete, toggleFav }: CardProps) {
    const { user } = useContext(AuthContext);
    const { addToast } = useContext(ToastContext);
    const formRef = useRef<FormHandles>(null);
    const imageContainer = useRef(null);
    const [petId, setPetId] = useState('');
    const [userId, setUserId] = useState('');
    const [reportModalIsOpen, setReportModalIsOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const reportRadioOptions = [
        { id: 'spam', value: 'spam', label: 'É spam' },
        { id: 'nudez ou atividade sexual', value: 'nudez ou atividade sexual', label: 'Nudez ou atividade sexual' },
        { id: 'simbolos ou discurso de odio', value: 'simbolos ou discurso de odio', label: 'Símbolos ou discurso de ódio' },
        { id: 'violencia', value: 'violencia', label: 'Violência' },
        { id: 'golpe ou fraude', value: 'golpe ou fraude', label: 'Golpe ou fraude' },
        { id: 'informação falsa', value: 'informação falsa', label: 'Informação falsa' },
    ]

    useEffect(() => {
        const images = imageContainer.current.querySelectorAll('img');

        images[currentImageIndex].style.opacity = 1;
    }, []);

    const handleReport = useCallback(async (data: FormData) => {
        console.log(data.denuncia)
        if (data.denuncia) {
            try {
                await api.post('/report/send', {
                    pet_id: petId,
                    user_id: userId,
                    motivation: data.denuncia
                });

                setReportModalIsOpen(false);
                addToast({
                    type: 'success',
                    title: 'Enviado com sucesso',
                    message: 'Denuncia encaminhada com sucesso.',
                });
            } catch (error) {
                addToast({
                    type: 'error',
                    title: 'Erro na envio',
                    message: 'Ocorreu algum erro no envio, tente novamente.',
                });
            }
        }
    }, []);

    const openReportModal = (pet_id: string, user_id: string) => {
        setReportModalIsOpen(true);
        setPetId(pet_id);
        setUserId(user_id);
    }

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
        <>
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
                        {!itsMyPet ?
                            fav ?
                                <button onClick={() => onDelete(fav.id)}>
                                    <IoMdHeart size={25} color="#F43434" />
                                </button>
                                :
                                itsFav ?
                                    <button onClick={() => toggleFav(pet.id)}>
                                        <IoMdHeart size={25} color="#F43434" />
                                    </button>
                                    :
                                    <button onClick={() => toggleFav(pet.id)}>
                                        <IoMdHeartEmpty size={25} color="#F43434" />
                                    </button>
                            :
                            <button onClick={() => onDelete(pet.id)}>
                                <IoMdTrash size={25} color="#F43434" />
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
                            <RWebShare
                                data={{
                                    text: 'Olha só, esse pet fofinho precisa de um novo lar. 😍🥺 ',
                                    url: `http://localhost:3000/pets/${pet.id}`,
                                    title: 'Love pets',
                                }}
                            >
                                <button>
                                    <IoMdShare size={25} color="#12BABA" />
                                </button>
                            </RWebShare>
                            {!itsMyPet &&
                                <button onClick={() => openReportModal(pet.id, pet.user_id)}>
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
                                    <a href={`https://api.whatsapp.com/send?phone=${pet.user_phone}`}
                                        target="_blank" rel="noopener noreferrer"
                                    >
                                        <button>
                                            <IoLogoWhatsapp size={40} color="#4EC953" />
                                        </button>
                                    </a>
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
            <Modal
                isOpen={reportModalIsOpen}
                onRequestClose={() => setReportModalIsOpen(false)}
                className={styles.reportModal}
                contentLabel="Por que você está denunciando esse anúncio?"
                style={{
                    overlay: {
                        zIndex: 999,
                    },
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                    }
                }}
            >
                <Form
                    className={styles.reportForm}
                    ref={formRef}
                    onSubmit={handleReport}
                >
                    <strong className={styles.reportTitle}>Por que você está denunciando esse anúncio?</strong>
                    <Radio
                        name="denuncia"
                        options={reportRadioOptions}
                    />
                    <button type="submit">Enviar</button>
                </Form>
            </Modal>
        </>
    )
}