import styles from './style.module.scss';
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

interface DefaultContainerProps {
    type: 'favs' | 'pets';
}

export default function Default({ type }: DefaultContainerProps) {
    return (
        <>
            <div className={styles.defaultContainer}>
                {type === 'pets' &&
                    <>
                        <strong>
                            Sem anúncios ainda.
                        </strong>
                        <img src="/default-dog.svg" alt="sem anúncios" />
                    </>
                }
                {type === 'favs' &&
                    <>
                        <strong>
                            Sem favoritos ainda.
                        </strong>
                        <img src="/default-cat.svg" alt="sem favoritos" />
                    </>
                }
            </div>
        </>
    )
}