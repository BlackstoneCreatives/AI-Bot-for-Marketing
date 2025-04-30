import { useEffect } from 'react';
import { initAuthListener } from '../lib/authListener';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css'; // Or your global styles

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    initAuthListener();
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
