"use client"; 

import { useState, useEffect } from 'react';

const Contador = () => {
  const [contador, setContador] = useState(0); //useState

  useEffect(() => { //useEffect
    console.log("El valor actual del contador es:", contador);
  }, [contador]);

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Contador: {contador}</h2>
        <button className="flex items-center gap-2 mx-auto px-7 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5" onClick={() => setContador(contador + 1)}>
        Incrementar
      </button>
    </div>
  );
};

export default Contador;