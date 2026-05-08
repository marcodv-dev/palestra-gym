import './pages.css'
import { motion } from "framer-motion";
import back from '../assets/back.png'
import bin from '../assets/bin.png'
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from "react";
import { deleteExerciseDB, getExerciseById, updateExerciseDB } from '../db';
import { toast } from 'react-toastify';
import { useLang } from '../i18n.jsx';

const ModExercise =()=>{
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useLang();
    const exerciseId = location.state?.id;
    const [exercise, setExercise] = useState(null);

    useEffect(() => {
        if (!exerciseId) return;
        getExerciseById(exerciseId).then(setExercise);
    }, [exerciseId]);

    const handleSave = async () => {
        await updateExerciseDB(exercise);
        toast.success(t('esercizioAggiornato'));
        navigate(-1);
    };

    const remove = async () => {
        const ok = window.confirm(t('seiSicuroEliminareEsercizio'));
        if (!ok) return;
        await deleteExerciseDB(exerciseId);
        toast.success(t('esercizioEliminato'));
        navigate(-1);
    };

  if (!exercise) return <div className="spinner" style={{margin:'auto'}} />;
    return(
        <main style={{display:'flex',flexDirection:'column',height:'100dvh'}}>
            <header className="header">
                <label htmlFor="title" translate="no">Gym</label>
                <motion.div
                    className='back'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1}}
                    exit={{ opacity: 0}}
                    transition={{ duration: 0.2 }}
                >
                    <button onClick={()=>navigate(-1)} className='backButton'>
                        <img src={back} alt="" className='invert-dark'/>
                    </button>
                </motion.div>
            </header>
            <motion.div
                className='mainAdd'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1}}
                exit={{ opacity: 0}}
                transition={{ duration: 0.2 }}
            >
                <input
                    style={{color: 'var(--text-primary)'}}
                    value={exercise.name}
                    placeholder={t('esercizio')}
                    onChange={(e) => setExercise({ ...exercise, name: e.target.value })}
                />
                <input
                    style={{color: 'var-(--text-primary)'}}
                    value={exercise.sets}
                    placeholder={t('serie')}
                    onChange={(e) => setExercise({ ...exercise, sets: e.target.value })}
                />
                <input
                    style={{color: 'var(--text-primary)'}}
                    value={exercise.reps}
                    placeholder={t('ripetizioni')}
                    onChange={(e) => setExercise({ ...exercise, reps: e.target.value })}
                />
                <input
                    style={{color: 'var(--text-primary)'}}
                    type="number"
                    value={exercise.peso}
                    placeholder={t('peso')}
                    onChange={(e) => setExercise({ ...exercise, peso: e.target.value === '' ? '' : Number(e.target.value) })}
                />

                <div className='buttonsMod'>
                    <button className='modificaButton elimina' onClick={remove}>
                        <img src={bin} alt="" className='invert-dark'/>
                    </button>

                    <button className='modificaButton' onClick={handleSave}>
                        <label htmlFor="">{t('confermaModifica')}</label>
                    </button>
                </div>
            </motion.div>
        </main>
    );
}

export default ModExercise;
