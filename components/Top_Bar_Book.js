
import React, { Component, Fragment} from 'react'
import styles from '../top_bar_styles.module.css'
import { FaBookOpen } from "react-icons/fa"
import { AiFillHome } from "react-icons/ai"
import { FcBookmark } from "react-icons/fc"
import _ from 'lodash'
import { MdClose } from "react-icons/md"
import { useRouter } from 'next/router'
import Link from 'next/link'


export default function Top_Bar_Book(props){



let title = props.selected_book == null ? 'Reader' : props.selected_book.title

    return (
      <div className = {styles.top_bar_frame} style = {{backgroundColor: 'whitesmoke'}}>


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
    />
</form>
{props.results.length > 0 && (<MdClose className = {styles.quit_search} onClick = {() => props.clear_input()}/>)}
</div>
)}


  </div>

    </div>
  )
}

