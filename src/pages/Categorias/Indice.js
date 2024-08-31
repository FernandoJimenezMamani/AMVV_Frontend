import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import '../../assets/css/Categoria/Indice.css'; 

const ListaCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState(null);
  const { campeonatoId } = useParams();  
  const navigate = useNavigate();
  console.log('campeonatoId:', campeonatoId);

  // Check if campeonatoId is being retrieved
  useEffect(() => {
    console.log('campeonatoId in ListaCategorias:', campeonatoId);
  }, [campeonatoId]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get('http://localhost:5002/api/categoria/get_categoria');
        setCategorias(response.data);
      } catch (error) {
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
  

  return (
    <div className="categorias-container">
      <h2 className="categorias-titulo">Lista de Categorías</h2>

      <button 
        className="division-button" 
        onClick={() => handleDivisionClick('MY')}
      >
        Mayores
      </button>

      <div className={`division-categorias ${selectedDivision === 'MY' ? 'show' : ''}`}>
        <div className="categorias-column">
          <h3>Varones</h3>
          <div className="categorias-list">
            {filterCategorias('MY', 'M').map((categoria) => (
              <div 
                key={categoria.id} 
                className="categoria-item-man"
                onClick={() => handleCategorySelect(categoria.id)}  // Handle category select
              >
                {categoria.nombre}
              </div>
            ))}
          </div>
        </div>

        <div className="categorias-column">
          <h3>Damas</h3>
          <div className="categorias-list">
            {filterCategorias('MY', 'F').map((categoria) => (
              <div 
                key={categoria.id} 
                className="categoria-item-women"
                onClick={() => handleCategorySelect(categoria.id)}  // Handle category select
              >
                {categoria.nombre}
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
          <h3>Varones</h3>
          <div className="categorias-list">
            {filterCategorias('MN', 'M').map((categoria) => (
              <div 
                key={categoria.id} 
                className="categoria-item-man"
                onClick={() => handleCategorySelect(categoria.id)}  // Handle category select
              >
                {categoria.nombre}
              </div>
            ))}
          </div>
        </div>

        <div className="categorias-column">
          <h3>Damas</h3>
          <div className="categorias-list">
            {filterCategorias('MN', 'F').map((categoria) => (
              <div 
                key={categoria.id} 
                className="categoria-item-women"
                onClick={() => handleCategorySelect(categoria.id)}  // Handle category select
              >
                {categoria.nombre}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListaCategorias;
