import imp from '../assets/import.png'
import view from '../assets/list-search.png'
import exp from '../assets/export.png'
import { exportAllExercises, getTypes, getExercises, addType, addExerciseDB, deleteType } from '../db'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useLang } from '../i18n.jsx'

const Files =()=>{
    const navigate = useNavigate();
    const { t } = useLang();

    const handleImport = async (e) => {
        const ok = window.confirm(t('questoCancellera'));
        if (!ok) return;

        const file = e.target.files[0];
        if (!file) return;

        try {
            const text = await file.text();
            const data = JSON.parse(text);

            // Elimina tipi ed esercizi esistenti
            const existingTypes = await getTypes();
            for (const t of existingTypes) {
                await deleteType(t.id);
            }

            // Supporta sia il nuovo formato {types, exercises} che il vecchio (solo array)
            const importedTypes = data.types || [];
            const importedExercises = data.exercises || (Array.isArray(data) ? data : []);

            // Mappa vecchi type_id ai nuovi
            const typeIdMap = {};

            // Importa i tipi
            for (const type of importedTypes) {
                try {
                    const newType = await addType(type.name);
                    typeIdMap[type.id] = newType.id;
                } catch (err) {
                    // Se esiste già, recupera l'id
                    const types = await getTypes();
                    const existing = types.find(t => t.name === type.name);
                    if (existing) {
                        typeIdMap[type.id] = existing.id;
                    }
                }
            }

            // Importa gli esercizi
            for (const ex of importedExercises) {
                const newEx = {
                    type_id: typeIdMap[ex.type_id] || ex.type_id,
                    name: ex.name,
                    reps: ex.reps,
                    sets: ex.sets,
                    peso: ex.peso,
                    order_index: ex.order_index || 0
                };
                await addExerciseDB(newEx);
            }

            toast.success(t('schedaImportata'));
            window.location.reload();
        } catch (err) {
            console.error(err);
            toast.error(t('erroreImport') + err.message);
        }
    };

    return(
        <div className="exportPage">
            <div>
                <button onClick={()=>navigate('/view')} className='buttonFiles'>
                    <img src={view} alt="" className='invert-dark'/>
                    <label style={{fontSize:'18px'}} htmlFor="">{t('visualizzaScheda')}</label>
                </button>
            </div>
            <div style={{display:'flex',gap:'20px'}}>
                <button onClick={exportAllExercises} className='buttonFiles'>
                    <img src={exp} alt="" className='invert-dark'/>
                    <label htmlFor="">{t('esportaScheda')}</label>
                </button>
                <button onClick={() => document.getElementById('importFile').click()} className='buttonFiles'>
                    <img src={imp} alt="" className='invert-dark'/>
                    <label htmlFor="">{t('importaNuovaScheda')}</label>
                </button>
                <input
                    type="file"
                    accept="application/json"
                    style={{ display: 'none' }}
                    id="importFile"
                    onChange={handleImport}
                />
            </div>
        </div>
    );
}

export default Files;
