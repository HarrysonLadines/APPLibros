// pages/_app.tsx
import { AppProps } from 'next/app';
import { AuthProvider } from '@/context/AuthContext';  // Asegúrate de la ruta correcta
import '../globals.css';  // Asegúrate de que esta línea esté presente



function MyApp({ Component, pageProps }: AppProps) {
  return (
    // Envuelve el componente principal en AuthProvider
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
