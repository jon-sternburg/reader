'use client'
import { useState, useRef, Fragment } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import styles from '../css/auth_form_styles.module.css'

// This goes to our signup API endpoint
async function createUser(email, password) {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    headers: {
      'Content-Type': 'application/json',
    }, 
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong!');
  }

  return data;
}

// This gets handled by the [...nextauth] endpoint
export default function Auth_Form() {
  const [registered, setRegistered] = useState(false)
  const [new_register, setNewRegistered] = useState(false)
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  // We keep track of whether in a login / or register state
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState);
  }

  async function submitHandler(event) {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    // optional: Add validation here
console.log('logging in...' , isLogin)
    if (isLogin) {
      let test = await signIn('credentials', {
        callbackUrl: 'http://localhost:3000',
   //     redirect: false,
        email: enteredEmail,
        password: enteredPassword,
      });
    //  router.push('/')
console.log(test)
    } else {
      try {
        const result = await createUser(enteredEmail, enteredPassword);
        setRegistered(true)
      } catch (error) {
        console.log(error);
      }
    }
  }


  function handle_registered() {
setIsLogin(true)
    setNewRegistered(true)
  //  router.push('/')

  }
  return (
<Fragment>
    {!new_register ? 
    <section className={styles.auth_form_wrap}>
      {!registered ? (
        <>
          <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
          <form onSubmit={submitHandler}>
            <div >
              <label htmlFor='email'>Your Email</label>
              <input type='email' id='email' required ref={emailInputRef} />
            </div>
            <div >
              <label htmlFor='password'>Your Password</label>
              <input
                type='password'
                id='password'
                required
                ref={passwordInputRef}
              />
            </div>
            <div className='my-5'>
              <button className='button button-color mr-4'>{isLogin ? 'Login' : 'Create Account'}</button>
              <button
                type='button'

                onClick={switchAuthModeHandler}>
                {isLogin ? 'No Account? Create One' : 'Already a user? Login'}
              </button>
            </div>
          </form>
        </>
      ) : (
        <div className=''>
          <p>You have successfully registered!</p>
          
          <button onClick={() => handle_registered()} className='button button-color'>Login Now</button>
          
        </div>
      )}

    </section>
    

: 


  <section className={styles.auth_form_wrap}>
        <h1>Login</h1>
        <form onSubmit={submitHandler}>
          <div >
            <label htmlFor='email'>Your Email</label>
            <input type='email' id='email' required ref={emailInputRef} />
          </div>
          <div >
            <label htmlFor='password'>Your Password</label>
            <input
              type='password'
              id='password'
              required
              ref={passwordInputRef}
            />
          </div>
          <div className='my-5'>
            <button type='submit' className='button button-color mr-4'>Login</button>
          </div>
        </form>

        </section>

    }
    </Fragment>
  );
}

