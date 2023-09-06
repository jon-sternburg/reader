'use client'
import React, {Fragment, useEffect, useState} from 'react'
import styles from '../css/topbar_styles.module.css'
import { AiFillCloseCircle } from "react-icons/ai"
import { FcBookmark } from "react-icons/fc"
import _ from 'lodash'
import { useSession, signOut, signIn } from 'next-auth/react';
import { RxHamburgerMenu } from "react-icons/rx"
import { useRouter, usePathname } from 'next/navigation';
import { AiFillGithub, AiFillHome } from "react-icons/ai"
import { FaUserCircle } from "react-icons/fa"

import Link from 'next/link';
type BookType = {
  title: string
  author: string
  url: string
  id: string
  path: string
  height: number
  width: number
  color?: string
  bg: string
  border: string
}


type TBHM_Props = {
  show_book_list: () => void
  book_list: boolean
}


export default function Top_Bar_Homepage_Mobile(props: TBHM_Props) {
  const [logged_in, toggle_login] = useState<boolean>(false)
  const [user_panel, toggle_user_panel] = useState<boolean>(false)
  const { data: session } = useSession()
  const pathname = usePathname();
   const router = useRouter()

  useEffect(() => {
    if (session?.user?.email) { 
      toggle_login(true)
    } else {
      toggle_login(false)
    }
  }, [session])

function handle_login() {
if (pathname.includes('login')) { 
  router.push('/')
} else {
  router.push('/login')
}
  }

  async function handle_signout() {
    await signOut({callbackUrl: 'http://localhost:3000',})
  }


  function handle_user_click(){


    if (session?.user?.email) { 
      router.push('/user')

    } else {

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

          <AiFillHome className={styles.user_icon} onClick={() => router.push('/')} />

        :
          <FaUserCircle className={styles.user_icon} onClick={() => handle_user_click()} />
      }


          <RxHamburgerMenu className={styles.hamburger_icon} onClick={() => props.show_book_list()} />
        </div>
      
      }


    </nav>
  )
}

