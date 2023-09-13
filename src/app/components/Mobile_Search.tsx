'use client'
import { SyntheticEvent } from 'react'
import styles from '../css/topbar_styles.module.css'
import { AiFillCloseCircle } from "react-icons/ai"


type MS_Props = {
  selected_book: BookType
  clear_input: () => void
  results_length: number
  keyvalue: string
  handle_text_submit: (e: SyntheticEvent) => void
  handleInputChange_text: (keyvalue: string) => void

}

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
export default function Mobile_Search(props: MS_Props) {



  return (

   



    <section className={styles.topbar_search_wrap_mobile} role="search">
      <form onSubmit={(e) => props.handle_text_submit(e)} >
        <input
          id="search_text_book"
          value={props.keyvalue}
          placeholder="Search text..."
          onChange={(e) => props.handleInputChange_text(e.target.value)}
        />
         <button type="submit">Search</button>
      </form>




      
      {props.results_length > 0 && (<AiFillCloseCircle className={styles.quit_search} onClick={() => props.clear_input()} />)}
    </section>


    

  )
}

