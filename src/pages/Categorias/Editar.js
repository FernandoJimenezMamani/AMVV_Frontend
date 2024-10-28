import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../../assets/css/Editar.css';
import { toast } from 'react-toastify';
import { Select } from 'antd';

const { Option } = Select;

const EditarCategoria = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    nombre: '',
    genero: 'V', // valor predeterminado
    division: 'MY', // valor predeterminado
    edad_minima: '', // Nueva columna
    edad_maxima: '', // Nueva columna
    costo_traspaso: '', // Nueva columna para costo de traspaso
    user_id: 2 // valor predeterminado
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategoria = async () => {
      try {
        const response = await axios.get(`http://localhost:5002/api/categoria/get_categoriaId/${id}`);
        setFormData({
          nombre: response.data.nombre,
          genero: response.data.genero,
          division: response.data.division,
          edad_minima: response.data.edad_minima || '',
          edad_maxima: response.data.edad_maxima || '',
          costo_traspaso: response.data.costo_traspaso || '',
          user_id: response.data.user_id
        });
      } catch (error) {
        toast.error('Error al obtener la categoría');
        console.error('Error al obtener la categoría:', error);
      }
    };

    fetchCategoria();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5002/api/categoria/update_categoria/${id}`, formData);
      toast.success('Editado con éxito');
      navigate('/categorias/indice');
    } catch (error) {
      toast.error('Error al actualizar la categoría');
      console.error('Error al actualizar la categoría:', error);
    }
  };

  return (
    <div className="editar-club">
      <h2>Editar Categoría</h2>
      <form onSubmit={handleSubmit}>
        <label className="label-edit">Nombre de la Categoría</label>
        <div className="form-group">
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Ingrese el nombre de la categoría"
          />
        </div>

        {/* Select para Género usando antd */}
        <div className="form-group">
          <label className="label-edit">Género</label>
          <Select
            id="genero"
            name="genero"
            value={formData.genero}
            onChange={(value) => handleSelectChange('genero', value)}
            style={{ width: '100%' }}
          >
            <Option value="V">Varones</Option>
            <Option value="D">Damas</Option>
            <Option value="M">Mixto</Option>
          </Select>
        </div>

        {/* Select para División usando antd */}
        <div className="form-group">
          <label className="label-edit">División</label>
          <Select
            id="division"
            name="division"
            value={formData.division}
            onChange={(value) => handleSelectChange('division', value)}
            style={{ width: '100%' }}
          >
            <Option value="MY">Mayores</Option>
            <Option value="MN">Menores</Option>
          </Select>
        </div>

        {/* Input para Edad Mínima */}
        <div className="form-group">
          <label className="label-edit">Edad Mínima</label>
          <input
            type="number"
            id="edad_minima"
            name="edad_minima"
            value={formData.edad_minima}
            onChange={handleChange}
            placeholder="Edad mínima (opcional)"
          />
        </div>

        {/* Input para Edad Máxima */}
        <div className="form-group">
          <label className="label-edit">Edad Máxima</label>
          <input
            type="number"
            id="edad_maxima"
            name="edad_maxima"
            value={formData.edad_maxima}
            onChange={handleChange}
            placeholder="Edad máxima (opcional)"
          />
        </div>

        {/* Input para Costo de Traspaso */}
        <div className="form-group">
          <label className="label-edit">Costo de Traspaso</label>
          <input
            type="number"
            id="costo_traspaso"
            name="costo_traspaso"
            value={formData.costo_traspaso}
            onChange={handleChange}
            placeholder="Costo de traspaso"
          />
        </div>

        <div className="form-group">
          <button id="edit-club-btn" type="submit">Guardar Cambios</button>
        </div>
      </form>
    </div>
  );
};

export default EditarCategoria;
