
import React, { Component, Fragment} from 'react'
import styles from '../top_bar_styles.module.css'
import { FaBookOpen } from "react-icons/fa"
import { AiFillHome } from "react-icons/ai"
import _ from 'lodash'
import { MdClose } from "react-icons/md"
import { useRouter } from 'next/router'
import Link from 'next/link'

let book_data = require('./update_books.json')

export default function Top_Bar_Book(props){



let title = props.selected_book == null ? 'Reader' : props.selected_book.title

    return (
      <div className = {styles.top_bar_frame}>


<div className = {styles.title_wrap} >
    <div className = {styles.book_icon_wrap} >
    <FaBookOpen id = {styles.book_icon} />
    </div>
    <div id = {styles.title} >{title}</div>
   </div>


    <div id = {styles.home_button} onClick = {() => props.select_book(null)}> 
    <AiFillHome id = {styles.home} />
    </div>

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
{props.results.length > 0 && (<MdClose id = {styles.quit_search} onClick = {() => props.clear_input()}/>)}
</div>
)}


  </div>

    </div>
  )
}

