import Contador from '../app/contador';

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', padding: '50px' }}>
      <h1>Contador en Next.js</h1>
      
      {/* Usamos nuestro componente */}
      <Contador />
    </main>
  );
}