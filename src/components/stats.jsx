import { getAverageWorkoutsPerMonth, getTotalExercisesDone, getTotalTypes, getTotalWorkouts, getWorkoutsPerMonth } from '../db'
import { useEffect, useState } from 'react'
import PerMonth from './perMonth.jsx'
import { useLang } from '../i18n.jsx'

const Stats =()=>{
    const { t } = useLang();
    const [stats, setStats] = useState({
        totalWorkouts: 0,
        totalExercises: 0,
        totalTypes: 0,
        perMonth: [],
        avg: 0
    });

    const maxCount = Math.max(...stats.perMonth.map(m => m.count), 0);
    const maxHeightGraph = Math.ceil(maxCount / 5) * 5;

    useEffect(() => {
        const loadStats = async () => {
            const totalWorkouts = await getTotalWorkouts();
            const totalExercises = await getTotalExercisesDone();
            const totalTypes = await getTotalTypes();
            const perMonth = await getWorkoutsPerMonth();
            const avg = await getAverageWorkoutsPerMonth();

            setStats({
                totalWorkouts,
                totalExercises,
                totalTypes,
                perMonth,
                avg
            });
        };
        loadStats();
    }, []);

    return(
        <div className="statsPage">
            <label htmlFor="" className='title'>{t('stats')}</label>
            <div className='statsCards'>
                <div className='statCard'>
                    <label htmlFor="">{t('schedeCorrenti')}</label>
                    <label htmlFor="">{stats.totalTypes}</label>
                </div>
                <div className='statCard'>
                    <label htmlFor="">{t('allenamentiTotali')}</label>
                    <label htmlFor="">{stats.totalWorkouts}</label>
                </div>
                <div className='statCard'>
                    <label htmlFor="">{t('eserciziTotali')}</label>
                    <label htmlFor="">{stats.totalExercises}</label>
                </div>
                <div className='statCard'>
                    <label htmlFor="">{t('mediaAllenamentiMese')}</label>
                    <label htmlFor="">{(stats.avg ?? 0).toFixed(1)}</label>
                </div>
            </div>
            {stats.totalWorkouts>0&&<div className='graph'>
                <label htmlFor="" className='title'>{t('datiMensili')}</label>
                <div style={{display:'flex'}} className='div_graph'>
                    <div className='scale'>
                        {Array.from({ length: maxHeightGraph+1 }, (_, i) => (
                            <label key={i}>{i}-</label>
                        ))}
                    </div>
                    <div className='graphMonthScroll'>
                        {stats.perMonth.map((e,i)=>(
                            <PerMonth key={i} val={e || ''} max={maxHeightGraph}/>
                        ))}
                    </div>
                </div>
            </div>}
        </div>
    );
}

export default Stats;