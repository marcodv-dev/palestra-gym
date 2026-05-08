import './pages.css'
import { motion } from "framer-motion";
import home from '../assets/home.png'
import add from '../assets/add.png'
import bin from '../assets/bin.png'
import tick from '../assets/tick.png'
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { deleteExercisesByType, deleteType, getExercisesOfType, updateExerciseDB, markExerciseDone, completeWorkout } from "../db";
import { toast } from 'react-toastify';
import { useLang } from '../i18n.jsx';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableItem = ({ ex, onDone, onEdit }) => {
    const { t } = useLang();
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: ex.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 1000 : 'auto',
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className={`esercizio`}>
            <button className='esercizioButton' onClick={onEdit}>
                <label htmlFor="title" translate="no">{ex.name}</label>
                <div className='dettagliEsercizio'>
                    <label className='sets' htmlFor="sets" translate="no">Sets: <b>{ex.sets}</b></label>
                    <label className='reps' htmlFor="reps" translate="no">Reps: <b>{ex.reps}</b></label>
                    <label className='peso' htmlFor="peso" translate="no">{t('pesoLabel')} <b>{ex.peso || '0'} {t('kg')}</b></label>
                </div>
            </button>
            <button onClick={(e) => { e.stopPropagation(); onDone(ex.id); }} className={`done ${ex.done?'yes':null}`}>
                <img src={tick} alt="" className='invert-dark'/>
            </button>
            <div className='div_drag'><div className='drag'/></div>
        </div>
    );
};

const Lower =()=>{
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useLang();
    const type = location.state?.type;
    const [exercises, setExercises] = useState([]);
    const [search, setSearch] = useState('');

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 10 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const filteredExercises = exercises.filter(ex =>
        ex.name.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        if (type?.id) {
            getExercisesOfType(type.id).then(setExercises);
        }
    }, [type]);

    const done = async (id) => {
        await markExerciseDone(id);
        if (type?.id) {
            getExercisesOfType(type.id).then(setExercises);
        }
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            const oldIndex = exercises.findIndex(e => e.id === active.id);
            const newIndex = exercises.findIndex(e => e.id === over.id);
            const newOrder = arrayMove(exercises, oldIndex, newIndex);
            setExercises(newOrder);

            for (let i = 0; i < newOrder.length; i++) {
                await updateExerciseDB({ ...newOrder[i], order_index: i });
            }
            toast.success(t('ordineAggiornato'));
        }
    };

    const handleDeleteType = async () => {
        const ok = window.confirm(t('seiSicuroEliminare'));
        if (!ok) return;

        await deleteExercisesByType(type.id);
        await deleteType(type.id);
        toast.success(t('allenamentoEliminato'));
        navigate('/');
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
                    <button onClick={()=>navigate('/')} className='homeButton'>
                        <img src={home} alt="" className='invert-dark'/>
                    </button>

                    <button onClick={handleDeleteType} className='binButton'>
                        <img src={bin} alt="" className='invert-dark'/>
                    </button>
                </motion.div>
            </header>
            <motion.div
                className='mainProgram'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1}}
                exit={{ opacity: 0}}
                transition={{ duration: 0.2 }}
            >
                <label htmlFor="" className='title'>{type?.name || type}</label>

                <div className="searchContainer">
                    <input
                        type="text"
                        placeholder={t('cercaEsercizio')}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="searchInput"
                    />
                    {search && <button onClick={()=>setSearch('')} className="clearSearch">✕</button>}
                </div>

                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={filteredExercises.map(e => e.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {filteredExercises.map((ex) => (
                            <SortableItem
                                key={ex.id}
                                ex={ex}
                                onDone={done}
                                onEdit={() => navigate('/modExercise', { state: { id: ex.id, from: type } })}
                            />
                        ))}
                    </SortableContext>
                </DndContext>

                <div className='fondo'/>
                <div className='train_buttons'>
                    <button onClick={()=>navigate('/addExercise',{state:{tipo:type}})} className='addButton'>
                        <img src={add} alt="" />
                    </button>
                    {exercises.some(e => e.done) && <button onClick={async ()=>{
                        await completeWorkout();
                        setExercises(exercises.map(e => ({...e, done: false})));
                        toast.success(t('allenamentoCompletato'));
                    }} className='completedButton'>
                        <label htmlFor="">{t('allenamentoCompletato')}</label>
                    </button>}
                </div>
            </motion.div>
        </main>
    );
}

export default Lower;
