import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import '../../assets/css/Categoria/Indice.css'; 
import { toast } from 'react-toastify';
import SportsVolleyballIcon from '@mui/icons-material/SportsVolleyball';
import WomanIcon from '@mui/icons-material/Woman';
import ManIcon from '@mui/icons-material/Man';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ListaCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState('MY'); 
  const { campeonatoId } = useParams();  

  const navigate = useNavigate();
  console.log('campeonatoId:', campeonatoId);

  useEffect(() => {
    console.log('campeonatoId in ListaCategorias:', campeonatoId);
  }, [campeonatoId]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/categoria/get_categoria`);
        setCategorias(response.data);
      } catch (error) {
        toast.error('error')
        console.error('Error al obtener las categorías:', error);
      }
    };

    fetchCategorias();
  }, []);

  const handleDivisionClick = (division) => {
    setSelectedDivision(selectedDivision === division ? null : division); // Toggle visibility
  };

  const filterCategorias = (division, genero) => {
    return categorias.filter(
      categoria => categoria.division === division && categoria.genero === genero
    );
  };

  const handleCategorySelect = (categoriaId) => {
    
    // Navigate to the IndicePartido component and pass both campeonatoId and categoriaId
    navigate(`/partidos/indice/${campeonatoId}/${categoriaId}`);
  };

  const handleResumenClick = () => {
    navigate(`/reportes/resumenCampeonato/${campeonatoId}`);
  };
  

  return (
    <div className="categorias-container">

    <div className="titulo-con-boton">
    <button className="boton-volver" onClick={() => navigate(`/campeonatos/indice`)}>
        <ArrowBackIcon />
      </button>
          <h2 className="all-matches-titulo">Seleccione una Categoría</h2>
        </div>

      <button 
        className="division-button" 
        onClick={() => handleDivisionClick('MY')}
      >
        Mayores
      </button>

      <div className={`division-categorias ${selectedDivision === 'MY' ? 'show' : ''}`}>
        <div className="categorias-column">
          <h3>Varones <ManIcon/></h3>
          <div className="categorias-list">
            {filterCategorias('MY', 'V').map((categoria) => (
              <div 
                key={categoria.id} 
                className="categoria-item-man"
                onClick={() => handleCategorySelect(categoria.id)}  // Handle category select
              >
                {categoria.nombre} <SportsVolleyballIcon/>
              </div>
            ))}
          </div>
        </div>

        <div className="categorias-column">
          <h3>Damas <WomanIcon/></h3>
          <div className="categorias-list">
            {filterCategorias('MY', 'D').map((categoria) => (
              <div 
                key={categoria.id} 
                className="categoria-item-women"
                onClick={() => handleCategorySelect(categoria.id)}  // Handle category select
              >
                {categoria.nombre} <SportsVolleyballIcon/>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button 
        className="division-button" 
        onClick={() => handleDivisionClick('MN')}
      >
        Menores
      </button>

      <div className={`division-categorias ${selectedDivision === 'MN' ? 'show' : ''}`}>
        <div className="categorias-column">
          <h3>Varones <ManIcon/></h3>
          <div className="categorias-list">
            {filterCategorias('MN', 'V').map((categoria) => (
              <div 
                key={categoria.id} 
                className="categoria-item-man"
                onClick={() => handleCategorySelect(categoria.id)}  // Handle category select
              >
                {categoria.nombre} <SportsVolleyballIcon/>
              </div>
            ))}
          </div>
        </div>

        <div className="categorias-column">
          <h3>Damas <WomanIcon/></h3>
          <div className="categorias-list">
            {filterCategorias('MN', 'D').map((categoria) => (
              <div 
                key={categoria.id} 
                className="categoria-item-women"
                onClick={() => handleCategorySelect(categoria.id)}  // Handle category select
              >
                {categoria.nombre} <SportsVolleyballIcon/>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListaCategorias;
