'use client'
import React, { Fragment, useState, useEffect } from "react";
import styles from '../../css/homepage_styles.module.css'
import Book_Box from '../../components/Book_Box'
import { useSearchParams } from 'next/navigation'
import all_book_data from '../../data/all_book_data.json'
import Head from 'next/head'
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation'

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
}

type Size = {
  width: number
  height: number
}


export default function App(): JSX.Element {
  const [size, set_dim] = useState<Size>({ width: 0, height: 0 })
  const [logged_in, set_logged_in] = useState<boolean>(false)
  const [selected_book, set_book] = useState<BookState>({ book: null, query_cfi: null })
  const params = useParams()
  const searchParams = useSearchParams()
  const { data: session } = useSession()

  useEffect(() => {
    if (session?.user?.email && !logged_in) { 

      set_logged_in(true)

    } else {
      set_logged_in(false)

    }
  
  }, [session])



  useEffect(() => {
    function updateDimensions() {
        set_dim({ width: window.innerWidth, height: window.innerHeight })
      }

    window.addEventListener('resize', updateDimensions);
    updateDimensions()
    return () => window.removeEventListener('resize', updateDimensions);
  }, [])


  useEffect(() => {
let id_ = params.book
let book_ = all_book_data.filter(x => x.id == id_)
let cfi_ = searchParams.get('cfi')
set_book({ book: book_[0], query_cfi: cfi_ })

// eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])







  return (
    <Fragment>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />
        <title>Reader!</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {size.width > 0 && (
      <main className={styles.main}>


        <section className={styles.homepage_frame} style={{ backgroundColor:  '#FFF' }}>

{selected_book.book !== null && (
                <Book_Box
                selected_book={selected_book.book}
                w={size.width}
                h={size.height}
                logged_in={logged_in}
                email={session?.user?.email ? session?.user?.email : null}
                user_id={session?.user?._id ? session?.user?._id : null}
                query_cfi={selected_book.query_cfi}
              />

)}

              
     
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


