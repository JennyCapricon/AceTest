import '@/styles/globals.css';
import { AuthProvider } from '@/lib/AuthContext';
import Head from 'next/head';

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Head>
        <title>AceTest - Exam Management Platform</title>
        <meta name="description" content="Modern exam management platform for schools and educators" />
      </Head>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
