'use client'
import { useRouter } from 'next/navigation';
import { getSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import styles from '../../css/auth_form_styles.module.css'
import Auth_Form from '../../components/Auth_Form';

export default function AuthPage() {
    /*
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // check if logged in and redirect to home page if so
  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        router.replace('/');
      } else {
        setIsLoading(false);
      }
    });
  }, [router]);

  if (isLoading) {
    return <p>Loading...</p>;
  }
*/
  return ( <Auth_Form /> )
}

