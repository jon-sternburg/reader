'use client'
import React, { Fragment, useState, useEffect } from "react";
import styles from './css/homepage_styles.module.css'
import Top_Bar_Homepage_Mobile from './components/Top_Bar_Homepage_Mobile'
import Sidebar_Homepage from './components/Sidebar_Homepage'
import Grid from './components/Grid'
import Book_Box from './components/Book_Box'

import { useRouter, useSearchParams} from 'next/navigation'
import all_book_data from './data/all_book_data.json'
import Head from 'next/head'
var qs = require('qs');

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
  const [selected_book, set_book] = useState<BookState>({ book: null, query_cfi: null, first_render: true })
  const [size, set_dim] = useState<Size>({ width: 0, height: 0 })
  const router = useRouter()
  const searchParams = useSearchParams()

  /*
  function handle_pop_state(e: PopStateEvent) {
    let target = e?.target as Window
    let dest_url = target.location.href
    let current = `http://localhost:3000/`
    if (current !== dest_url  ) {

      let test = qs.parse(dest_url)
      let id_: string =  test[`/?book`] 
      let book_ = all_book_data.filter(x => x.id == id_)
      let cfi_ = test.cfi ? test.cfi : null
      if (book_ && book_[0] !== null) {
        set_book((prevState) => {
          return { ...prevState, book: book_[0], query_cfi: cfi_ }
        })
      }
    } 
    return true;
      }
  
        useEffect(() => {
          window.addEventListener('popstate', handle_pop_state);
    
            return () => {
    
              window.removeEventListener("popstate", handle_pop_state);
    
            }
        }, []);
  */


  useEffect(() => {
    window.addEventListener('resize', updateDimensions);
    updateDimensions()
    return () => window.removeEventListener('resize', updateDimensions);
  }, [])

/*
 
  useEffect(() => {

    let book_id  = searchParams.get('book')
    let cfi = searchParams.get('cfi')

    if (book_id !== null) {

      let book_ = all_book_data.filter(x => x.id == book_id)
      let ls_data = localStorage.getItem(book_[0].id + '-locations')
      let loc = ls_data !== null && ls_data !== undefined && ls_data !== 'undefined' ? JSON.parse(ls_data) : null
      let loc_ = loc !== null && loc && loc.start ? loc.start.cfi : null
      set_book({ book: book_[0], query_cfi: cfi !== null ? cfi : loc_, first_render: false })
    } else {
      set_book({ book: null, query_cfi: null, first_render: false })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
*/

  function show_book_list() {
    set_book_list(!book_list)
  }

  function updateDimensions() {
    set_dim({ width: window.innerWidth, height: window.innerHeight })
  }

  function select_book(book: BookType | null) {
    if (book !== null) {
      let ls_data = localStorage.getItem(book.id + '-locations')
      let loc = ls_data !== null && ls_data !== undefined && ls_data !== 'undefined' ? JSON.parse(ls_data) : null

      if (loc !== null && loc && loc.start) {
        router.push(`/?book=${book.id}&cfi=${loc.start.cfi}`)
        set_book({ ...selected_book, book: book, query_cfi: loc.start.cfi })
        if (book_list) { set_book_list(false) }
      } else {
        router.push(`/?book=${book.id}`)
        set_book({ ...selected_book, book: book, query_cfi: null })
        if (book_list) { set_book_list(false) }
      }

    } else {
      router.push(`/`)
      set_book({ ...selected_book, book: book, query_cfi: null })
      if (book_list) { set_book_list(false) }
    }
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
        {size.width < 1000 && selected_book.book == null && (
          <Top_Bar_Homepage_Mobile
            show_book_list={show_book_list}
            book_list={book_list}
          />
        )}

        <section className={styles.homepage_frame} style={{ backgroundColor: selected_book.book == null ? 'whitesmoke' : '#FFF' }}>


  

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
                 // select_book={select_book}
                  w={size.width}
                  show_book_list={show_book_list}
                  h={size.height}
                />
                :
                <Book_Box
                  selected_book={selected_book.book}
              //    select_book={select_book}
                  w={size.width}
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


