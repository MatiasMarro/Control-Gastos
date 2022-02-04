import { useState, useEffect } from 'react'
import Header from './components/Header'
import Modal from './components/Modal';
import Filtros from './components/Filtros';
import { generarId } from './helpers';
import ListadoGastos from './components/ListadoGastos';

import IconoNuevoGasto from './img/nuevo-gasto.svg'
import { objectOf } from 'prop-types';


function App() {

  const [gastos,setGastos]=useState(
    localStorage.getItem('gastos') ? JSON.parse(localStorage.getItem('gastos')) : []
  )

  const [presupuesto,setPresupuesto] = useState(
    Number(localStorage.getItem('presupuesto')) ?? 0
  );
  const [isValidPresupuesto, setIsValidPresupuesto] = useState(false)

  const [modal,setModal]=useState(false);
  const [animarModal,setAnimarModal]=useState(false);

  const [gastoEditar, setGastoEditar] = useState({})

  const [filtro, setFiltro]= useState('')
  const [gastosFiltrados, setGastosFiltrados]= useState([])

  useEffect(() => {
    if(Object.keys(gastoEditar).length > 0){
      setModal(true);


      setTimeout(() => {
        setAnimarModal(true)
    }, 300);
    }
  }, [gastoEditar])
  
  useEffect(() => {
    localStorage.setItem('presupuesto', presupuesto ?? 0)
  }, [presupuesto])


  useEffect(() => {
    if(filtro){
      //Filtrar Gastos por categoria
      const gastosFiltrados = gastos.filter( (gasto) => {
        return gasto.categoria === filtro
      });

      setGastosFiltrados(gastosFiltrados)
    }

    
  }, [filtro])


  useEffect(() => {
    localStorage.setItem('gastos', JSON.stringify(gastos) ?? [])
  }, [gastos])

  useEffect(() => {
    const presupuestoLS = Number(localStorage.getItem('presupuesto')) ?? 0

    if(presupuestoLS > 0){
      setIsValidPresupuesto(true)
    }
  }, [])

  
  
  const handleNuevoGasto = ()=>{
    setModal(true);
    setGastoEditar({})

    setTimeout(() => {
      setAnimarModal(true)
    }, 300);
  }

  const eliminarGasto = id =>{
    const gastosActualizados = gastos.filter(gastos => gastos.id !== id)
    setGastos(gastosActualizados)
  }

  const guardarGasto = gasto =>{

    if(gasto.id){
      //Actualizar
      const gastosActualizados = gastos.map( gastoState => gastoState.id === gasto.id ? gasto : gastoState )
      setGastos(gastosActualizados)
      setGastoEditar({})
    }else{
      //Nuevo gasto
      gasto.id = generarId();
      gasto.fecha=Date.now();
      setGastos([...gastos,gasto])
    }
    

    setAnimarModal(false)
    setTimeout(() => {
      setModal(false)
    }, 500);
  }

  return (
    <div className={modal ? 'fijar':''}>
    <Header
      gastos={gastos}
      setGastos={setGastos}
      presupuesto={presupuesto}
      setPresupuesto={setPresupuesto}
      isValidPresupuesto={isValidPresupuesto}
      setIsValidPresupuesto={setIsValidPresupuesto}
    />


    {isValidPresupuesto && (
      <>
        <main>
          <Filtros 
            filtro={filtro}
            setFiltro={setFiltro}
          />
          <ListadoGastos 
            gastos={gastos}
            setGastoEditar={setGastoEditar}
            eliminarGasto={eliminarGasto}
            filtro={filtro}
            gastosFiltrados={gastosFiltrados}
          />
        </main>
        <div className='nuevo-gasto'>
          <img 
            src={IconoNuevoGasto}
            alt="Nuevo gasto"
            onClick={handleNuevoGasto}
          />
        </div>
      </>
    )}

    {modal && <Modal
                setModal={setModal}
                animarModal={animarModal}
                setAnimarModal={setAnimarModal}
                guardarGasto={guardarGasto}
                gastoEditar={gastoEditar}
                setGastoEditar={setGastoEditar}
              /> }
      
    </div>
  )
}

export default App
