'use client'
import React, { Fragment, useState, useEffect } from "react";
import styles from '../css/homepage_styles.module.css'
import Book_Box from './Book_Box'
import { useSession } from 'next-auth/react';
import { Annotation } from "epubjs/types/annotations";


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

type Size = {
  width: number
  height: number
}

type BP_Props = {
  book: BookType
  cfi?: string | string[] | undefined
}

type Annotation_Item = {
  type: string
  cfiRange: string
  data: {
    text: string
    data: string
    section: string
    time: string
    title: string
    epubcfi: string
  }
  sectionIndex: number
  mark?: {
    element: null
    className: string
    data: {
      text: string
      data: string
      section: string
      time: string
      title: string
      epubcfi: string
    }
    attributes: {
      fill: string
      'fill-opacity': string
      'mix-blend-mode': string
    }
  }
}


type A_State = Annotation_Item[] | []




export default function Book_Page(props: BP_Props): JSX.Element {
  const [size, set_dim] = useState<Size>({ width: 0, height: 0 })
  const [logged_in, set_logged_in] = useState<boolean | null>(null)
  const [annotations, set_annotations] = useState<A_State>([])
  const { data: session, status } = useSession()

  useEffect(() => {

    console.log('fired')
    async function get_book_data(book_id: string, user_id: string) {
      return await fetch(`/api/book?book_id=${book_id}&user_id=${user_id}`, {
        method: 'GET',
      })
        .then((res) => res.json())
        .then((data) => {

if (data[0]) { 
  set_annotations(data[0].annotations)
  set_logged_in(true)
} else {
  set_annotations([])
  set_logged_in(true)
}
        })
        .catch(err => {
          console.log(err)
          set_annotations([])
          set_logged_in(true)
        })
    }
    
    function get_ls_data(book_id:string) {
      let ls_data = localStorage.getItem(book_id + '-annotations')
      let a = ls_data !== undefined && ls_data !== 'undefined' ? JSON.parse(ls_data || '{}') : []
      set_annotations(a)
      set_logged_in(false)
    }

    if (status == 'authenticated') {

     get_book_data(props.book.id, session.user._id)

    } else { 

      get_ls_data(props.book.id)
    }

  }, [ status, props.book.id])

function update_annotations(a: Annotation[]) {

set_annotations(a.map((x:any) => x[1]))

}

  useEffect(() => {
    function updateDimensions() {
        set_dim({ width: window.innerWidth, height: window.innerHeight })
      }

    window.addEventListener('resize', updateDimensions);
    updateDimensions()
    return () => window.removeEventListener('resize', updateDimensions);
  }, [])


  return (
    <Fragment>
      {size.width > 0 && logged_in !== null && (
      <main className={styles.main}>


        <section className={styles.homepage_frame} style={{ backgroundColor:  '#FFF' }}>


                <Book_Box
                selected_book={props.book}
                w={size.width}
                h={size.height}
                logged_in={logged_in}
                email={session?.user?.email ? session?.user?.email : null}
                user_id={session?.user?._id ? session?.user?._id : null}
                query_cfi={props.cfi}
                annotations={annotations}
                update_annotations={update_annotations}
              />


              
     
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


