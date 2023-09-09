'use client'
import React, { SyntheticEvent, useState, useEffect } from 'react'
import styles from '../css/topbar_styles.module.css'
import { AiFillHome } from "react-icons/ai"
import { FcBookmark } from "react-icons/fc"
import _ from 'lodash'
import { MdClose } from "react-icons/md"
import { useRouter, useSearchParams } from 'next/navigation';
import { usePathname } from "next/navigation"
import { useSession } from 'next-auth/react';
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


type TBB_Props = {
 // select_book: (book: BookType | null) => void
  selected_book: BookType
  clear_input: () => void
  results_length: number
  keyvalue: string
  handle_text_submit: (e: SyntheticEvent) => void
  handleInputChange_text: (keyvalue: string) => void
  w: number
}


export default function Top_Bar_Book(props: TBB_Props) {
  const [logged_in, toggle_login] = useState<boolean>(false)
  const searchParams = useSearchParams()
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

  let cfi_params = searchParams.get('cfi')
  let cfi = cfi_params ? `?cfi=${cfi_params}` : ''
  let pn = pathname + cfi

  localStorage.setItem('prev_url_login', JSON.stringify(pn));

  router.push('/login')
}
  }


  let title = props.selected_book == null ? 'Reader' : props.selected_book.title

  return (
    <nav className={styles.top_bar_frame_book} style={{ backgroundColor: 'whitesmoke' }}>
      <div className={styles.title_wrap} >
        <div className={styles.book_icon_wrap} >
          <FcBookmark className={styles.book_icon} />
        </div>
        <div className={styles.title} >{title}</div>
      </div>







      <div className={styles.header_wrap}>

      {props.results_length > 0 && (<MdClose className={styles.quit_search} onClick={() => props.clear_input()} />)}
        {props.w > 1000 && (
          <div className={styles.topbar_search_wrap} role="search">
            <form onSubmit={(e) => props.handle_text_submit(e)} >
              <input
                id="search_text_book"
                value={props.keyvalue}
                placeholder="Search text..."
                onChange={(e) => props.handleInputChange_text(e.target.value)}
                type={"search"}
                name={"search_text_book"}
              />
            </form>
      
          </div>
        )}

<div className = {styles.grid_buttons_top_wrap}>
{!logged_in ? 
<button type = {'button'} className = {styles.login_button} onClick = {() => handle_login()}>Login</button>
: logged_in && session?.user?.email ? 
  <Link  href = {'/user'} className = {styles.user_tag_top}>{session.user.email}</Link>
: null
}
<button type={"button"} className={styles.home_button} onClick={() => router.push('/')}> 
        <AiFillHome className={styles.home} />
      </button>
</div>
      </div>

    </nav>
  )
}

