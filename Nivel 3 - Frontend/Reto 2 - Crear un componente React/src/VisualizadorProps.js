import { useEffect, useState } from 'react';

const VisualizadorProps = ({nombre, fecha}) => {
    const [visitas, setVisitas] = useState(0);

    useEffect(() => {
        document.title = `Datos de ${nombre}`;
    }, [nombre]);

    return (
        <div className="visualizador-props">
            <h1>Visualizador de Props</h1>
            <p>Nombre: {nombre}</p>
            <p>Fecha: {fecha}</p>
            <p>Visitas: {visitas}</p>

            <button onClick={() => setVisitas(visitas + 1)}>
                Registrar visita
            </button>
        </div>
    );
};

export default VisualizadorProps;