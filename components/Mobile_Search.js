
import React, { Component, Fragment} from 'react'
import styles from '../top_bar_styles.module.css'
import { FaBookOpen } from "react-icons/fa"
import { AiFillHome } from "react-icons/ai"
import _ from 'lodash'
import { MdClose } from "react-icons/md"
let book_data = require('./update_books.json')

export default function Mobile_Search(props){


let title = props.selected_book == null ? 'Reader' : props.selected_book.title

    return (
      <div className = {styles.topbar_search_wrap_mobile} role="search">
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





 
  )
}

