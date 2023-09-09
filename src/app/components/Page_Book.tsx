'use client'
import React, { Fragment, useState, useEffect } from "react";
import styles from '../css/homepage_styles.module.css'
import Book_Box from './Book_Box'
import { useSession } from 'next-auth/react';


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
  cfi?: string | null


}


export default function Book_Page(props: BP_Props): JSX.Element {
  const [size, set_dim] = useState<Size>({ width: 0, height: 0 })
  const [logged_in, set_logged_in] = useState<boolean>(false)
  const { data: session } = useSession()


  useEffect(() => {

    if (session?.user?.email) { 
   
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


  return (
    <Fragment>
      {size.width > 0 && (
      <main className={styles.main}>


        <section className={styles.homepage_frame} style={{ backgroundColor:  '#FFF' }}>


                <Book_Box
                selected_book={props.book}
                w={size.width}
                h={size.height}
                logged_in={logged_in}
                email={session?.user?.email ? session?.user?.email : null}
                user_id={session?.user?._id ? session?.user?._id : null}
                query_cfi={props.cfi ? props.cfi : null}
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


