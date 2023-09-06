'use client'
import React, {Fragment, useState, useEffect} from 'react'
import styles from '../css/grid_styles.module.css'
import popular from '../data/popular.json'
import { useSession, signOut, signIn } from 'next-auth/react';
import { MdKeyboardArrowRight } from "react-icons/md"
import { AiFillGithub } from "react-icons/ai"
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePathname } from "next/navigation"

type G_Props = {
 // select_book: (book: BookType | null) => void
  w: number
  h: number
  show_book_list: () => void
}

type BookType = {
  title: string
  author: string
  url: string
  id: string
  path: string
  height: number
  width: number
  bg: string
  border: string
  color?: string
}



export default function Grid(props: G_Props): JSX.Element {

const [logged_in, toggle_login] = useState<boolean>(false)

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


function select_book(x:BookType){


router.push(`/book/${x.id}`)

}


  async function handle_signout() {
    await signOut({callbackUrl: 'http://localhost:3000',})

    //const data = await signOut({redirect: false, callbackUrl: "/"})
   // router.push(data.url)


  }


  return (
    <div className={styles.frame}>

<div className = {styles.grid_buttons_top_wrap}>
{!logged_in ? 
<button type = {'button'} onClick = {() => handle_login()}>Login</button>

: logged_in && session?.user?.email ? 
<Fragment>
  <Link  href = {'/user'} className = {styles.user_tag_top}>{session.user.email}</Link>
<button type = {'button'} className = {styles.sign_out_top} onClick = {() =>  handle_signout()}>Sign out</button>
</Fragment>
: null
}
<AiFillGithub className = {styles.github_icon} />
</div>


      <section className={styles.hero_wrap}>

        <div className={styles.hero_top}>
          <h2>Read your favorite eBooks from the Project Gutenberg Library</h2>
          <h4>Full annotation, highlight, and text search support</h4>
        </div>
        {props.w <= 1000 && (

          <div className={styles.view_all_books} onClick={() => props.show_book_list()}>
            <span>View all books</span>
            <MdKeyboardArrowRight className={styles.view_all_books_icon} />
          </div>


        )}
      </section>

      <section className={styles.featured_frame}>
        {popular.map((x, i) => {
          return <article key={x.title + i} className={styles.grid_box} style={{ backgroundColor: x.bg }} onClick={() => select_book(x)}>

            <img
              alt={`book cover for ${x.title}`}
              className={styles.book_img}
              src={`/covers/${x.id}.jpg`}
              height={140}
              width={100}
              style={{ border: `2px solid ${x.border}` }}
            />

            <header className={styles.underbox}>
              <h4 className={styles.title}>{x.title}</h4>
              <h5 className={styles.author}>{x.author}</h5>
            </header>


          </article>

        })}
      </section>

    </div>
  )
}