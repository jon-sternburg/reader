import React, {Fragment, useState, useEffect } from "react";
import styles from '../homepage_styles.module.css'
import Top_Bar_Homepage from '../components/Top_Bar_Homepage'
import Top_Bar_Homepage_Mobile from '../components/Top_Bar_Homepage_Mobile'
import Sidebar_Homepage from '../components/Sidebar_Homepage'
import Grid from '../components/Grid'
import Book_Box from '../components/Book_Box'
import { useRouter } from 'next/router'
import all_book_data from '../data/all_book_data.json'
import Head from 'next/head'
var qs = require('qs');

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


export default function App():JSX.Element {
const [book_list, set_book_list] = useState<boolean>(false) 
const [selected_book, set_book] = useState<BookState>({book: null, query_cfi: null, first_render: true})
const [size, set_dim] = useState<Size>({width: 0, height: 0})
const router = useRouter()


useEffect(() => {
 if (router.asPath == '/') {   
router.beforePopState((x) => {
if (x.as !== router.asPath) {
let test = qs.parse(x.as)
let id_:string = test.cfi ? test[`/?book`] : x.as.replace('/?book=', '')
let book_ = all_book_data.filter( x => x.id == id_)
let cfi_ = test.cfi ? test.cfi : null
if (book_ && book_[0] !== null) {
set_book({...selected_book, book: book_[0], query_cfi: cfi_})
}
}
        return true;
    });
    return () => {
        router.beforePopState(() => true);
}};}, [router]); 



useEffect(() => {
window.addEventListener('resize', updateDimensions);
updateDimensions()
return () => window.removeEventListener('resize', updateDimensions);
}, [])



useEffect(() => {
let test = qs.parse(router.asPath)
if (router.asPath.includes('/?book=')) {
let id_ = test.cfi ? test[`/?book`] : router.asPath.replace('/?book=', '')
let book_ = all_book_data.filter( x => x.id == id_)
let ls_data = localStorage.getItem(book_[0].id+'-locations')
let loc = ls_data !== null && ls_data !== undefined && ls_data !== 'undefined' ? JSON.parse(ls_data) : null
let loc_ = loc !== null && loc && loc.start ? loc.start.cfi : null
set_book({book: book_[0], query_cfi: test.cfi ? test.cfi : loc_, first_render: false})
} else {
set_book({book: null, query_cfi: null, first_render: false})
}
}, [])


function show_book_list() {
set_book_list(!book_list)
}

function updateDimensions() {
set_dim({width: window.innerWidth, height: window.innerHeight})
}

function select_book(book: BookType | null) {
if (book !== null) {
let ls_data = localStorage.getItem(book.id+'-locations')
let loc = ls_data !== null && ls_data !== undefined && ls_data !== 'undefined' ? JSON.parse(ls_data) : null

if (loc !== null && loc && loc.start) { 
router.push( `/?book=${book.id}&cfi=${loc.start.cfi}`, `/?book=${book.id}&cfi=${loc.start.cfi}`, {shallow: true})
set_book({...selected_book, book: book, query_cfi: loc.start.cfi})
if (book_list) {set_book_list(false)}
} else {
router.push( `/?book=${book.id}`,`/?book=${book.id}`,{shallow: true})    
set_book({...selected_book, book: book, query_cfi: null})
if (book_list) {set_book_list(false)}
}

} else {
router.push( `/`,`/`)
set_book({...selected_book, book: book, query_cfi: null})
if (book_list) {set_book_list(false)}
}
}


    return (
        <Fragment>
<Head>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />
<title>Reader! {selected_book.book !== null && selected_book.book ? selected_book.book.title : ''}</title>
<link rel="icon" href="/favicon.ico" />
</Head>

<main className = {styles.main}>
{size.width < 1000 && selected_book.book  == null  && ( 
<Top_Bar_Homepage_Mobile
selected_book = {selected_book.book}
select_book = {select_book}
w={size.width}
show_book_list = {show_book_list}
book_list = {book_list}
h={size.height}
/>
)}

<section className = {styles.homepage_frame} style = {{backgroundColor: selected_book.book == null ? 'whitesmoke' : '#FFF'}}>

{!selected_book.first_render && (


     <Fragment>
{(size.width >= 1000 && selected_book.book == null) || book_list  ? 
<Sidebar_Homepage 
select_book = {select_book}
w={size.width}
h={size.height}
book_list={book_list}
/>
: null
}





{selected_book.book  == null ? 
<Grid 
select_book = {select_book}
w={size.width}
show_book_list = {show_book_list}
h={size.height}
 />
:
<Book_Box 
selected_book = {selected_book.book}
select_book = {select_book}
w={size.width}
h={size.height}
query_cfi = {selected_book.query_cfi}
/>
}

   </Fragment>
)}
    </section>
    </main>
    <style jsx global>{`
      body {
        margin: 0px;
        padding: 0px;
      }
    `}</style>
    </Fragment>
)
  }


