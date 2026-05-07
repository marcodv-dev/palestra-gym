import './pages.css'
import { motion } from "framer-motion";
import back from '../assets/back.png'
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import { addExerciseDB, getExercisesOfType, getTypes, addType } from '../db';
import { toast } from 'react-toastify';
import { useLang } from '../i18n.jsx';

const AddExercise =()=>{
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useLang();
    const tipo = location.state?.tipo;
    const [type, setType] = useState(tipo?.name || tipo || '');
    const [name, setName] = useState('');
    const [reps, setReps] = useState('');
    const [sets, setSets] = useState('');
    const [peso, setPeso] = useState('');
    const [types, setTypes] = useState([]);

    useEffect(() => {
        getTypes().then(setTypes);
    }, []);

    const addExercise = async () => {
        if (!type.trim()) {
            toast.error(t('tipo') + ' ' + t('cercaEsercizio').toLowerCase());
            return;
        }

        let typeId;
        const existingType = types.find(t => t.name.toLowerCase() === type.trim().toLowerCase());

        if (existingType) {
            typeId = existingType.id;
        } else {
            const newType = await addType(type.trim());
            typeId = newType.id;
            setTypes([...types, newType]);
        }

        const existing = await getExercisesOfType(typeId);
        const newExercise = {
            type_id: typeId,
            name,
            reps,
            sets,
            peso,
            order_index: existing.length
        };

        await addExerciseDB(newExercise);

        setName('');
        setReps('');
        setSets('');
        setPeso('');

        toast.success(t('esercizioAggiunto'));
        if (tipo) {
            navigate('/train',{state:{type: {id: typeId, name: type}}});
        } else {
            navigate('/');
        }
    };

    const handleBack = () => {
        if (tipo) {
            navigate('/train',{state:{type: tipo}});
        } else {
            navigate('/');
        }
    };

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
                    <button onClick={handleBack} className='backButton'>
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
                    type="text"
                    name="type"
                    id=""
                    placeholder={t('tipo')}
                    value={type}
                    onChange={(e)=>setType(e.target.value)}
                    style={{color: 'var(--text-primary)'}}
                    list="types-list"
                />
                {types.length > 0 && (
                    <datalist id="types-list">
                        {types.map(t => (
                            <option key={t.id} value={t.name} />
                        ))}
                    </datalist>
                )}

                <input type="text" name="name" id="" placeholder={t('esercizio')} value={name} onChange={(e)=>setName(e.target.value)} style={{color: 'var(--text-primary)'}}/>

                <input type="text" name="sets" id="" placeholder={t('serie')} value={sets} onChange={(e)=>setSets(e.target.value)} style={{color: 'var(--text-primary)'}}/>

                <input type="text" name="reps" id="" placeholder={t('ripetizioni')} value={reps} onChange={(e)=>setReps(e.target.value)} style={{color: 'var(--text-primary)'}}/>

                <input type="number" name="weigth" id="" placeholder={t('peso')} value={peso} onChange={(e)=>setPeso(e.target.value)} style={{color: 'var(--text-primary)'}}/>

                <button className={`aggiungiButton ${(!type || !name || !reps || !sets || !peso)?'disabled':null}`} disabled={!type || !name || !reps || !sets || !peso} onClick={addExercise}>
                    <label htmlFor="">{t('aggiungiEsercizio')}</label>
                </button>
            </motion.div>
        </main>
    );
}

export default AddExercise;
