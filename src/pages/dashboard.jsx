import './pages.css'
import { motion, AnimatePresence } from "framer-motion";
import training from '../assets/training.png'
import training_fill from '../assets/training-fill.png'
import folder from '../assets/folder.png'
import folder_fill from '../assets/folder-fill.png'
import graph_bar from '../assets/graph_bar.png'
import graph_bar_fill from '../assets/graph_bar-fill.png'
import add from '../assets/add.png'
import logout_img from '../assets/logout.png'
import settings from '../assets/setting.png'
import close from '../assets/close.png'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getTypes, logout, isAuthenticated } from '../db'
import Files from '../components/files.jsx'
import Stats from '../components/stats.jsx'
import { useLang } from '../i18n.jsx'

const Dashboard =({page,setPage})=>{
    const navigate = useNavigate();
    const { t, lang, setLang } = useLang();
    const [types, setTypes] = useState([]);
    const [showMenu, setShowMenu] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/login');
            return;
        }
        loadTypes();
    }, [navigate]);

    const loadTypes = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await getTypes();
            setTypes(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Error loading types:', err);
            setError(err.message);
            setTypes([]);
        } finally {
            setLoading(false);
        }
    };
    
    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    
    return(
        <main style={{display:'flex',flexDirection:'column',height:'100dvh',overflowY:'hidden',scrollbarWidth:'none'}}>
            <AnimatePresence>
                {showMenu && (
                    <div className='menuContainer'>
                    <motion.div
                        className="menuSfondo"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => {
                            setShowMenu(false);
                        }}
                    >
                    </motion.div>
                    <motion.div
                        className="menu"
                        initial={{ right: "-350px" }}
                        animate={{ right: "0px" }}
                        exit={{ right: "-350px" }}
                        transition={{ duration: 0.2 }}
                    >
                        <button
                            onClick={() => {
                                setShowMenu(false);
                            }}
                        className="closeButton"
                        >
                            <img src={close} alt="" className="invert-dark" />
                        </button>
                        
                        <div className="statCard">
                            <label htmlFor="">Language</label>
                            <select
                                className="langSelect"
                                onChange={(e) => setLang(e.target.value)}
                                value={lang}
                                style={{
                                background: "transparent",
                                border: "none",
                                color: "var(--text-primary)",
                                fontSize: "14px",
                                }}
                            >
                                <option value="en">EN</option>
                                <option value="it">IT</option>
                            </select>
                        </div>
                        <button onClick={handleLogout} className='logout'>
                            <img src={logout_img} alt="" />
                            {t('logout') || 'Esci'}
                        </button>
                    </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <header className="header">
                <label htmlFor="title" translate="no">GYM</label>
                <motion.div
                    className='back'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1}}
                    exit={{ opacity: 0}}
                    transition={{ duration: 0.2 }}
                >
                    <button onClick={()=>{
                        setShowMenu(true);
                    }} className='settingsButton'>
                        <img src={settings} alt="" className="invert-dark"/>
                    </button>
                </motion.div>
            </header>
            <motion.div
                className='pages'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1}}
                exit={{ opacity: 0}}
                transition={{ duration: 0.2 }}
            >
                {error && (
                    <div style={{color: 'red', padding: '10px', textAlign: 'center'}}>
                        {error}
                        <button onClick={loadTypes} style={{marginLeft: '10px'}}>Riprova</button>
                    </div>
                )}

                {page=='training'&&
                <motion.div
                    className='main'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1}}
                    exit={{ opacity: 0}}
                    transition={{ duration: 0.2 }}
                >
                {loading ? <div className="spinner" style={{margin:'40px auto'}} /> :
                <div className='allenamentoButtons'>
                    {types.map((t)=>(
                        <button key={t.id} onClick={()=>navigate(`/train`,{state:{type:t}})} className='tipoAllenamentoButton'>
                            <label htmlFor="tipo" translate="no">{t.name}</label>
                        </button>
                    ))}
                    <button onClick={()=>navigate('/addExercise')} className='tipoAllenamentoButton'>
                        <img src={add} alt="" className='invert-dark'/>
                    </button>
                </div>}
                </motion.div>}

                {page=='export'&&
                <motion.div
                    className='main files'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1}}
                    exit={{ opacity: 0}}
                    transition={{ duration: 0.2 }}
                >
                    <label style={{marginTop:'20px'}} htmlFor="" className='title'>{t('files')}</label>
                    <Files/>
                </motion.div>}

                {page=='stats'&&
                <motion.div
                    className='main'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1}}
                    exit={{ opacity: 0}}
                    transition={{ duration: 0.2 }}
                >
                    <Stats/>
                </motion.div>}

                <footer className='footer'>
                    <button className='footerButton' onClick={()=>{
                        if(page!='export'){
                            setPage('export');
                        }
                    }}>
                        <img src={page=='export'?folder_fill:folder} alt="" className='invert-dark'/>
                        <label htmlFor="export" translate="no" >Files</label>
                    </button>
                    <button className='footerButton' onClick={()=>{
                        if(page!='training'){
                            setPage('training');
                        }
                    }}>
                        <img src={page=='training'?training_fill:training} alt="" className='invert-dark'/>
                        <label htmlFor="training" translate="no">Training</label>
                    </button>
                    <button className='footerButton' onClick={()=>{
                        if(page!='stats'){
                            setPage('stats');
                        }
                    }}>
                        <img src={page=='stats'?graph_bar_fill:graph_bar} alt="" className='invert-dark'/>
                        <label htmlFor="stats" translate="no">Stats</label>
                    </button>
                    
                </footer>
            </motion.div>
        </main>
    );
}

export default Dashboard;
