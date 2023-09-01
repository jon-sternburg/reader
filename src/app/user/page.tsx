'use client'
import React, { Fragment, useState, useEffect } from "react";
import styles from '../css/homepage_styles.module.css'
import Top_Bar_Homepage_Mobile from '../components/Top_Bar_Homepage_Mobile'
import Sidebar_Homepage from '../components/Sidebar_Homepage'
import Grid from '../components/Grid'
import Book_Box from '../components/Book_Box'
import { useRouter } from 'next/navigation'
import Head from 'next/head'
import { useSession } from "next-auth/react"
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
  const [size, set_dim] = useState<Size>({ width: 0, height: 0 })
  const router = useRouter()



  useEffect(() => {
    window.addEventListener('resize', updateDimensions);
    updateDimensions()
    return () => window.removeEventListener('resize', updateDimensions);
  }, [])



  function updateDimensions() {
    set_dim({ width: window.innerWidth, height: window.innerHeight })
  }
  const { data } = useSession()

  return (
    <Fragment>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />
        <title>Reader! - User</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {size.width > 0 && (
      <main className={styles.main}>
        <section className={styles.homepage_frame} style={{  background: 'whitesmoke' }}>
   

                
        <pre>{JSON.stringify(data, null, 2)}</pre>


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

