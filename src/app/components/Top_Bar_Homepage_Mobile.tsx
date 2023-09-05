'use client'
import React from 'react'
import styles from '../css/topbar_styles.module.css'
import { AiFillCloseCircle } from "react-icons/ai"
import { FcBookmark } from "react-icons/fc"
import _ from 'lodash'
import { RxHamburgerMenu } from "react-icons/rx"


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

  //let title = props.selected_book == null ? 'Reader!' : props.selected_book.title

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

        <RxHamburgerMenu className={styles.hamburger_icon} onClick={() => props.show_book_list()} />
      }


    </nav>
  )
}

