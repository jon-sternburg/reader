
import React, { SyntheticEvent} from 'react'
import styles from '../css/topbar_styles.module.css'
import { AiFillHome } from "react-icons/ai"
import { FcBookmark } from "react-icons/fc"
import _ from 'lodash'
import { MdClose } from "react-icons/md"


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
select_book: (book: BookType | null) => void
selected_book: BookType
clear_input:() => void
results_length: number
keyvalue: string
handle_text_submit:(e:SyntheticEvent) => void
handleInputChange_text:(keyvalue: string) => void
w: number
}


export default function Top_Bar_Book(props:TBB_Props){



let title = props.selected_book == null ? 'Reader' : props.selected_book.title

    return (
      <nav className = {styles.top_bar_frame_book} style = {{backgroundColor: 'whitesmoke'}}>


<div className = {styles.title_wrap} >
    <div className = {styles.book_icon_wrap} >
    <FcBookmark className = {styles.book_icon} />
    </div>
    <div className = {styles.title} >{title}</div>
   </div>


    <button type = {"button"} className = {styles.home_button} onClick = {() => props.select_book(null)}> 
    <AiFillHome className = {styles.home} />
    </button>

<div className = {styles.header_wrap}>


{props.w > 1000 && ( 
<div className = {styles.topbar_search_wrap} role="search">
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
{props.results_length > 0 && (<MdClose className = {styles.quit_search} onClick = {() => props.clear_input()}/>)}
</div>
)}


  </div>

    </nav>
  )
}

