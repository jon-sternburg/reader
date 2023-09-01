'use client'
import { useRouter } from 'next/navigation';
import { getSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

import Auth_Form from '../components/Auth_Form';

function AuthPage() {
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

export default AuthPage;