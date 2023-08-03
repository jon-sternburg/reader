
import React, { Component, useState, useEffect, Fragment} from 'react'
import styles from '../homepage_styles.module.css'
import Sidebar from './Sidebar'
import Top_Bar_Homepage from './Top_Bar_Homepage'
import Top_Bar_Homepage_Mobile from './Top_Bar_Homepage_Mobile'
import Grid from './Grid'
import Book_Box from './Book_Box'
import { useRouter } from 'next/router'
import all_book_data from '../data/all_book_data.json'
import Head from 'next/head'
var qs = require('qs');
const storage = global.localStorage || null;

export default function Homepage(props) {
const [selected_book, set_book] = useState({book: props.book_query, query_cfi: props.query_cfi}) 
const router = useRouter()



useEffect(() => {
 if (router.asPath == '/') {   
router.beforePopState((x) => {
if (x.as !== router.asPath) {
let test = qs.parse(x.as)
let id_ = test.cfi ? test[`/?book`] : x.as.replace('/?book=', '')
let book_ = all_book_data.filter( x => x.id == id_)
let cfi_ = test.cfi ? test.cfi : null
set_book({book: book_[0], query_cfi: cfi_})
}

        return true;
    });

    return () => {
        router.beforePopState(() => true);

}

    };
}, [router]); 




function select_book(book) {



if (book !== null) {
let loc = localStorage.getItem(book.id+'-locations') !== undefined ? JSON.parse(localStorage.getItem(book.id+'-locations')) : null

if (loc !== null && loc && loc.start) { 
router.push( `/?book=${book.id}&cfi=${loc.start.cfi}`, `/?book=${book.id}&cfi=${loc.start.cfi}`, {shallow: true})
set_book({book: book, query_cfi: loc.start.cfi})
} else {
router.push( `/?book=${book.id}`,`/?book=${book.id}`,{shallow: true})    
set_book({book: book, query_cfi: null})
}

} else {
router.push( `/`,`/`)
set_book({book: book, query_cfi: null})
}
}


    return (
        <Fragment>
<Head>
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reader! {selected_book.book !== null ? selected_book.book.title : ''}</title>
<link rel="icon" href="/favicon.ico" />

</Head>
<main className = {styles.main}>
<section className = {styles.homepage_frame} style = {{backgroundColor: selected_book.book == null ? 'whitesmoke' : '#FFF'}}>
{props.size.width >= 1000 && selected_book.book == null  && ( 
<Top_Bar_Homepage
selected_book = {selected_book.book}
select_book = {select_book}
w={props.size.width}
h={props.size.height}
/>
)}


{props.size.width < 1000 && selected_book.book  == null  && ( 
<Top_Bar_Homepage_Mobile
selected_book = {selected_book.book}
select_book = {select_book}
w={props.size.width}
h={props.size.height}
/>
)}



{selected_book.book  == null ? 
<Grid 
selected_book = {selected_book.book}
select_book = {select_book}
w={props.size.width}
h={props.size.height}
 />
:
<Book_Box 
selected_book = {selected_book.book}
select_book = {select_book}
w={props.size.width}
h={props.size.height}
query_cfi = {selected_book.query_cfi}
/>
}

    </section>
    </main>
    </Fragment>
)
  }