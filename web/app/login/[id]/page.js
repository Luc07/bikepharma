'use client'
import { useParams } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Login = () => {
  const { id } = useParams();
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    if (id) {
      login(id);
      router.push('/dashboard');
    }
  }, [id]);

  return <div>Carregando...</div>;
};

export default Login;
