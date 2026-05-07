import { useEffect, useState } from "react";
import { getExercisesOfType, getTypes } from "../db";
import { useNavigate } from "react-router-dom";
import back from '../assets/back.png'
import { motion } from "framer-motion";
import { useLang } from '../i18n.jsx';

const ViewTrain =()=>{
    const navigate = useNavigate();
    const { t } = useLang();
    const [exercisesByType, setExercisesByType] = useState([]);

    useEffect(() => {
        getTypes().then(async (types) => {
            const data = await Promise.all(
                types.map(async (type) => {
                    const exercises = await getExercisesOfType(type.id);
                    return { type, exercises };
                })
            );
            setExercisesByType(data);
        });
    }, []);

    return(
        <main className="viewPage">
            <header className="header">
                <label htmlFor="title" translate="no">Gym</label>
                <motion.div
                    className='back'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1}}
                    exit={{ opacity: 0}}
                    transition={{ duration: 0.2 }}
                >
                    <button onClick={()=>{
                        navigate('/');
                    }} className='backButton'>
                        <img src={back} alt="" className="invert-dark"/>
                    </button>
                </motion.div>
            </header>

            <motion.div
                className='view'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1}}
                exit={{ opacity: 0}}
                transition={{ duration: 0.2 }}
            >
                <label style={{marginTop:'20px'}} htmlFor="" className='title'>{t('train')}</label>

                <div className="currentTrain">
                    {exercisesByType.map(({ type, exercises }) => (
                        <div key={type.id} className="singleTrain">
                            <label htmlFor="" className="subTitleTrain">{type.name}</label>

                            {exercises.map(ex => (
                            <div key={ex.id} className={`singleEx`}>
                                <label htmlFor="title">{ex.name}</label>
                                <div className='dettagliEx'>
                                    <label className='reps' htmlFor="reps">Reps: <b>{ex.reps}</b></label>
                                    <label className='sets' htmlFor="sets">Sets: <b>{ex.sets}</b></label>
                                    <label className='peso' htmlFor="peso">{t('pesoLabel2')} <b>{ex.peso} {t('kg2')}</b></label>
                                </div>
                            </div>))}
                        </div>
                    ))}
                </div>
            </motion.div>
        </main>
    );
}

export default ViewTrain;
