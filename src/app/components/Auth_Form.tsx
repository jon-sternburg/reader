'use client'
import { useState, useRef, Fragment, FormEvent, useEffect, RefObject } from 'react';
import { signIn } from 'next-auth/react';
import styles from '../css/auth_form_styles.module.css'
import {useRouter} from 'next/navigation'

async function createUser(email:string, password:string) {
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


export default function Auth_Form():JSX.Element {
  const [registered, setRegistered] = useState<boolean>(false)
  const [new_register, setNewRegistered] = useState<boolean>(false)
  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const passwordInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter()

  const [isLogin, setIsLogin] = useState(true);


  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState);
  }

  async function submitHandler(event: FormEvent) {
    event.preventDefault();

    const enteredEmail = emailInputRef?.current?.value ? emailInputRef.current.value : ''
    const enteredPassword = passwordInputRef?.current?.value ? passwordInputRef.current.value : ''


    if (isLogin) {
//get previous url from local storage - this allows modal login window (route intercept) while user is reading book
      let ls_data = localStorage.getItem('prev_url_login')
      let cb_url = ls_data !== undefined && ls_data !== 'undefined' ? JSON.parse(ls_data || '{}') : []
      let url = process.env.NEXT_PUBLIC_CB_URL + cb_url

await signIn('credentials', {
        callbackUrl: url,
        redirect: true,
        email: enteredEmail,
        password: enteredPassword,
      });
      
    } else {
      try {
     await createUser(enteredEmail, enteredPassword);
        setRegistered(true)
      } catch (error) {
        console.log(error);
      }
    }
  }

function handle_tint_click() {
router.back()
}
  function handle_registered() {
setIsLogin(true)
setNewRegistered(true)
  }
  return (


<div className = {styles.window_tint}>
<OutsideAlerter handle_tint_click = {handle_tint_click}>
    {!new_register ? 
    <section className={styles.auth_form_wrap}>
      {!registered ? (
        <Fragment>
        <header>
          <h1>{isLogin ? 'Login Now' : 'Sign Up'}</h1>
          </header>


      <form onSubmit={submitHandler} id = {"login_form"}>
            <div className = {styles.field_wrap}>

              <input type='email' id='email'   placeholder='email' required ref={emailInputRef} />
              <input type='password' placeholder='password' id='password' required ref={passwordInputRef} />
     
            </div>

            <div className = {styles.submit_wrap}>

              <button className = {styles.left_button} type = {"submit"}>{isLogin ? 'Login' : 'Create Account'}</button>
              <button className = {styles.right_button} type='button' onClick={switchAuthModeHandler}>{isLogin ? 'Sign Up' : 'Already a user? Login'}</button>
              
            </div>

          </form>

        </Fragment>
      ) : (
        <div className=''>
          <p>You have successfully registered!</p>
          
          <button onClick={() => handle_registered()} className='button button-color'>Login Now</button>
          
        </div>
      )}

    </section>
    

: 


  <section className={styles.auth_form_wrap} >
        <h1>Login</h1>
        <form onSubmit={submitHandler}>
          <div >
            <label htmlFor='email'>Email</label>
            <input type='email' id='email' required ref={emailInputRef} />
          </div>
          <div >
            <label htmlFor='password'>Password</label>
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
    </OutsideAlerter>
    </div>

    
  );
}


type OA_Props = {
  handle_tint_click: () => void
  children: JSX.Element | JSX.Element[]
}

function OutsideAlerter(props: OA_Props): JSX.Element {
  const wrapperRef = useRef(null);

  function useOutsideAlerter(ref: RefObject<HTMLElement>) {
    useEffect(() => {

      function handleClickOutside(event: Event) {
        const target = event.target as HTMLElement
        if (ref.current && !ref.current.contains(target)) {
          props.handle_tint_click()
        }
      }

      document.addEventListener("mousedown", handleClickOutside);
      return () => {

        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);

  } useOutsideAlerter(wrapperRef);
  return <div ref={wrapperRef} >{props.children}</div>;
}




