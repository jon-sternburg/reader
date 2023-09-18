'use client'
import { SyntheticEvent } from 'react'
import styles from '../css/topbar_styles.module.css'
import { FcBookmark } from "react-icons/fc"
import _ from 'lodash'
import { MdClose } from "react-icons/md"
import { AiFillHome, AiOutlineSearch } from "react-icons/ai"
import { useRouter, useSearchParams } from 'next/navigation';
import { usePathname } from "next/navigation"



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
  selected_book: BookType
  clear_input: () => void
  results_length: number
  keyvalue: string
  handle_text_submit: (e: SyntheticEvent) => void
  handleInputChange_text: (keyvalue: string) => void
  w: number
  email: string
  logged_in: boolean
}


export default function Top_Bar_Book(props: TBB_Props) {
  const searchParams = useSearchParams()
 const pathname = usePathname();
  const router = useRouter()


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
    <header className={styles.top_bar_frame_book} style={{ backgroundColor: 'whitesmoke' }}>
      <div className={styles.title_wrap} >
        <div className={styles.book_icon_wrap} >
          <FcBookmark className={styles.book_icon} />
        </div>
        <span className={styles.title} >{title}</span>
      </div>







      <div className={styles.header_wrap}>

      
      {props.results_length <= 0 && props.keyvalue.length > 2 && (<button aria-label = {"Submit search"}  type = {"button"}><AiOutlineSearch className={styles.quit_search_topbar_book} onClick={(e) => props.handle_text_submit(e)} /></button>)}
      {props.results_length > 0 && (<button aria-label = {"Cancel search"}  type = {"button"}><MdClose className={styles.quit_search_topbar_book} onClick={() => props.clear_input()} /></button>)}
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

<nav className = {styles.book_buttons_top_wrap}>
{!props.logged_in ? 
<button aria-label = {"Login"} type = {'button'} className = {styles.login_button} onClick = {() => handle_login()}><span>Login</span></button>
: 
<a  href = {'/user'} className = {styles.user_tag_top}><span>{props.email}</span></a>
}
<button aria-label = {"Home"} type={"button"} className={styles.home_button} onClick={() => router.push('/')}> 
        <AiFillHome className={styles.home} />
      </button>
</nav>
      </div>

    </header>
  )
}

