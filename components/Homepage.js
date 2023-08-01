
import React, { Component, useState, useEffect} from 'react'
import styles from '../homepage_styles.module.css'
import Sidebar from './Sidebar'
import Top_Bar_Homepage from './Top_Bar_Homepage'
import Top_Bar_Homepage_mobile from './Top_Bar_Homepage_mobile'
import Grid from './Grid'
import Book_Box from './Book_Box'
import { useRouter } from 'next/router'




export default function Homepage(props) {

const router = useRouter()

const [selected_book, set_book] = useState(props.book_query)




function select_book(book) {

if (book !== null) {
router.push( `/?book=${book.id}`,`/?book=${book.id}`,{shallow: true})
set_book(book)
} else {
router.push( `/`,`/`,{shallow: true})
set_book(book)
}
}


    return (

<main id = 'main'>
<div className = {styles.homepage_frame} style = {{backgroundColor: selected_book == null ? 'whitesmoke' : '#FFF'}}>
{props.size.width >= 1000 && selected_book == null  && ( 
<Top_Bar_Homepage
select_book = {select_book} 
selected_book = {selected_book}
w={props.size.width}
h={props.size.height}
/>
)}


{props.size.width < 1000 && selected_book == null  && ( 
<Top_Bar_Homepage_mobile
select_book = {select_book} 
selected_book = {selected_book}
w={props.size.width}
h={props.size.height}
/>
)}



{selected_book == null ? 
<Grid 
select_book = {select_book} 
w={props.size.width}
h={props.size.height}
 />
:
<Book_Box 
selected_book = {selected_book}
select_book = {select_book}
w={props.size.width}
h={props.size.height}
loc_query = {props.loc_query}
/>
}

    </div>
    </main>
)
  }