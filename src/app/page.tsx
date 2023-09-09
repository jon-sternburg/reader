'use client'
import React, { Fragment, useState, useEffect } from "react";
import styles from './css/homepage_styles.module.css'
import Top_Bar_Homepage_Mobile from './components/Top_Bar_Homepage_Mobile'

import { useSession, signOut } from 'next-auth/react';
import Sidebar_Homepage from './components/Sidebar_Homepage'
import Grid from './components/Grid'
import Book_Box from './components/Book_Box'
import Head from 'next/head'


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

type BookState = {
  book: null | BookType
  query_cfi: string | null
  first_render: boolean
}

type Size = {
  width: number
  height: number
}


export default function App(): JSX.Element {
  const [book_list, set_book_list] = useState<boolean>(false)
  const [logged_in, toggle_login] = useState<boolean>(false)
  const [selected_book, set_book] = useState<BookState>({ book: null, query_cfi: null, first_render: true })
  const [size, set_dim] = useState<Size>({ width: 0, height: 0 })

  const { data: session } = useSession()
 //const pathname = usePathname();
 // const router = useRouter()

  useEffect(() => {
    window.addEventListener('resize', updateDimensions);
    updateDimensions()
    return () => window.removeEventListener('resize', updateDimensions);
  }, [])


  useEffect(() => {

    if (session?.user?.email) { 
      toggle_login(true)
    } else {
      toggle_login(false)
    }
  
  }, [session])
  function show_book_list() {
    set_book_list(!book_list)
  }

  function updateDimensions() {
    set_dim({ width: window.innerWidth, height: window.innerHeight })
  }


  return (
    <Fragment>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />
        <title>Reader!</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {size.width > 0 && (
      <main className={styles.main}>
        {size.width < 1000 && selected_book.book == null ? 
          <Top_Bar_Homepage_Mobile
            show_book_list={show_book_list}
            book_list={book_list}
            logged_in={logged_in}
          />
          :
   null
        }

        <section className={styles.homepage_frame} style={{ backgroundColor: 'whitesmoke'  }}>




            <Fragment>
              {(size.width >= 1000 && selected_book.book == null) || book_list ?
                <Sidebar_Homepage
                  w={size.width}
                  h={size.height}
                  book_list={book_list}
                />
                : null
              }

              {selected_book.book == null ?
                <Grid
                  w={size.width}
                  show_book_list={show_book_list}
                  h={size.height}
                  logged_in={logged_in}
                  email={session?.user?.email ? session?.user?.email  : null}
                />
                :
                <Book_Box
                  selected_book={selected_book.book}
                  w={size.width}
                  logged_in={logged_in}
                  email={session?.user?.email ? session?.user?.email : null}
                  user_id={session?.user?._id ? session?.user?._id : null}
                  h={size.height}
                  query_cfi={selected_book.query_cfi}
                />
              }

            </Fragment>
         
        </section>
      </main>
           )}
      <style jsx global>{`
      body {
        margin: 0px;
        padding: 0px;
      }
    `}</style>
    </Fragment>
  )
}

