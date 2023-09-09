'use client'
import React, {Fragment} from 'react'
import styles from '../css/topbar_styles.module.css'
import { AiFillCloseCircle } from "react-icons/ai"
import { FcBookmark } from "react-icons/fc"
import { signOut } from 'next-auth/react';
import { RxHamburgerMenu } from "react-icons/rx"
import { useRouter, usePathname } from 'next/navigation';
import { AiFillHome } from "react-icons/ai"
import { FaUserCircle } from "react-icons/fa"




type TBHM_Props = {
  show_book_list: () => void
  book_list: boolean
  logged_in: boolean
}


export default function Top_Bar_Homepage_Mobile(props: TBHM_Props) {
 // const [logged_in, toggle_login] = useState<boolean>(false)
 // const [user_panel, toggle_user_panel] = useState<boolean>(false)
 // const { data: session } = useSession()
  const pathname = usePathname();
   const router = useRouter()
/*
  useEffect(() => {
    if (session?.user?.email) { 
      toggle_login(true)
    } else {
      toggle_login(false)
    }
  }, [session])
*/

  async function handle_signout() {
    await signOut({callbackUrl: process.env.NEXTAUTH_URL})
  }


  function handle_user_click(){


    //if (session?.user?.email) { 
      if (props.logged_in) { 
      router.push('/user')

    } else {
      localStorage.setItem('prev_url_login', JSON.stringify(''));
      router.push('/login')

    }



  }
  return (

    <nav className={styles.top_bar_frame_mobile}>

      <div className={styles.title_wrap_mobile}>
        <div className={styles.book_icon_wrap_mobile} >
          <FcBookmark className={styles.book_icon_mobile} />
        </div>
        <div className={styles.title_mobile} >{'Reader!'}</div>
      </div>

      {props.book_list ?

        <AiFillCloseCircle className={styles.close_grid_sidebar_icon} onClick={() => props.show_book_list()} />

        :
        <div className ={styles.mobile_right_icon_wrap}>

        {pathname.includes('user') ? 
      <Fragment>
          <AiFillHome className={styles.user_icon} onClick={() => router.push('/')} />
          <button type = {'button'} className = {styles.sign_out_top} onClick = {() =>  handle_signout()}>Sign out</button>  
          </Fragment>
        :
        <Fragment>
          <FaUserCircle className={styles.user_icon} onClick={() => handle_user_click()} />
          <RxHamburgerMenu className={styles.hamburger_icon} onClick={() => props.show_book_list()} />
          </Fragment>
      }


     
        </div>
      
      }


    </nav>
  )
}

