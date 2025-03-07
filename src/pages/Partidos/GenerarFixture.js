import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Button, Table, Avatar, Tag } from "antd";
import { toast } from "react-toastify";
import "../../assets/css/Partidos/GenerarFixture.css";
import moment from "moment";
import "moment/locale/es";
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const GenerarFixture = () => {
  const { campeonatoId, categoriaId } = useParams();
  const [partidos, setPartidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [registering, setRegistering] = useState(false);
  const navigate = useNavigate();

  const generarFixture = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/partidos/generar-fixture-completo/${campeonatoId}/${categoriaId}`
      );
      setPartidos(response.data.partidos);
      toast.success("Fixture generado correctamente.");
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message || "Error desconocido al generar el fixture.");
      } else {
        toast.error("Error al generar el fixture.");
      }
      console.error("Error al generar fixture:", error);
    }
    setLoading(false);
  };
  

  const registrarPartidos = async () => {
    if (partidos.length === 0) {
      toast.warning("No hay partidos generados para registrar.");
      return;
    }
  
    setRegistering(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/partidos/registrar-partidos/${campeonatoId}/${categoriaId}`, // ✅ Parámetros en la URL
        {
          partidos, 
        }
      );
  
      toast.success(response.data.message || "Partidos registrados con éxito.");
      navigate(`/partidos/indice/${campeonatoId}/${categoriaId}`);
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message || "Error desconocido al registrar los partidos.");
      } else {
        toast.error("Error al registrar los partidos.");
      }
      console.error("🚨 Error al registrar partidos:", error);
    }
    setRegistering(false);
  };
  
  

  // Columnas de la tabla
  const columns = [
    {
      title: "Fecha",
      dataIndex: "fecha",
      key: "fecha",
      render: (text) => moment(text).format("D [de] MMMM [de] YYYY, HH:mm [hrs]"),
      sorter: (a, b) => new Date(a.fecha) - new Date(b.fecha),
    },
    {
      title: "Equipo Local",
      dataIndex: "equipo_local",
      key: "equipo_local",
      render: (_, record) => (
        <div className="fixture-equipo-info">
          <Avatar size="large" src={record.equipo_local_img} />
          <span className="fixture-equipo-nombre">{record.equipo_local}</span>
        </div>
      ),
    },
    {
      title: "Equipo Visitante",
      dataIndex: "equipo_visitante",
      key: "equipo_visitante",
      render: (_, record) => (
        <div className="fixture-equipo-info">
          <Avatar size="large" src={record.equipo_visitante_img} />
          <span className="fixture-equipo-nombre">{record.equipo_visitante}</span>
        </div>
      ),
    },
    {
      title: "Lugar",
      dataIndex: "lugar_id",
      key: "lugar_id",
      render: (lugar) => <Tag color="blue">{lugar.nombre}</Tag>,
    },
    {
      title: "Árbitros",
      dataIndex: "arbitros",
      key: "arbitros",
      render: (arbitros) =>
        arbitros?.map((arb) => (
          <Tag color="green" key={arb.id}>
            {arb.nombre} {arb.apellido}
          </Tag>
        )) || "Sin árbitros asignados",
    },
  ];

  return (
    <div className="generar-fixture-container">
      <h2 className="fixture-title">Generar y Registrar Fixture</h2>

      <div className="fixture-buttons">
        <button 
          type="primary" 
          onClick={generarFixture} 
          loading={loading} 
          className="fixture-generate-btn"
        >
          Generar Fixture
        </button>

        <button 
          type="primary" 
          onClick={registrarPartidos} 
          loading={registering} 
          disabled={partidos.length === 0} 
          className="fixture-registrar-btn"
        >
          Registrar Partidos
        </button>
      </div>

      <Table
        dataSource={partidos}
        columns={columns}
        rowKey={(record, index) => index}
        className="fixture-table"
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default GenerarFixture;
