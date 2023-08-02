import React, {Fragment, useState, useEffect, useRef, useCallback  } from "react";
import Homepage from '../../components/Homepage'
import Book_Box from '../../components/Book_Box'
var qs = require('qs');
import styles from '../../homepage_styles.module.css'
const all_book_data = require('../../components/all_book_data.json')
const storage = global.localStorage || null;
/*
export async function getStaticProps( query ) {
let id_ = query.params.book
let book_ = all_book_data.filter( x => x.id == id_)
      return { props: { 
        book: book_,
        key: book_.id + '_id'
      }}
 }




export async function getStaticPaths() {

const paths = all_book_data.map((x) => ({
params: { book: x.id}
}))

return { paths, fallback: false }

}
*/

export const getServerSideProps = async ({query, req, res, resolvedUrl}) => {


let book_ = all_book_data.filter( x => x.id == query.book)
console.log(query)
      return { props: { 
        book: book_,
        query_cfi: query.cfi ? query.cfi : null,
        key: book_.id + '_id'
      }}



}



const App = (props) => {
const [size, set_dim] = useState({width: 0, height: 0})
const [selected_book, set_book] = useState({book: props.book[0], query_cfi: props.query_cfi}) 


useEffect(() => {
window.addEventListener('resize', updateDimensions);
updateDimensions()
return () => window.removeEventListener('resize', updateDimensions);
}, [])

console.log('props: ', props)

/*
useEffect(() => {
let test = qs.parse(router.asPath)
if (router.asPath.includes('/?book=')) {
let id_ = test.cfi ? test[`/?book`] : router.asPath.replace('/?book=', '')
let book_ = all_book_data.filter( x => x.id == id_)
set_book_query({data: book_[0], loc: test.cfi ? test.cfi : null})
} else {
set_book_query({data: null, loc: null})
}
}, [])
*/

function select_book(book) {



if (book !== null) {
let loc = localStorage.getItem(book.id+'-locations') !== undefined ? JSON.parse(localStorage.getItem(book.id+'-locations')) : null

if (loc !== null && loc && loc.start) { 
router.push( `/?book=${book.id}&cfi=${loc.start.cfi}`, `/?book=${book.id}&cfi=${loc.start.cfi}`, {shallow: true})
set_book({book: book, query_cfi: loc.start.cfi})
} else {
router.push( `/?book=${book.id}`,`/?book=${book.id}`,{shallow: true})    
set_book({book: book, query_cfi: props.query_cfi})
}

} else {
router.push( `/`,`/`,{shallow: true})
set_book({book: book, query_cfi: props.query_cfi})
}
}



function updateDimensions() {
set_dim({width: window.innerWidth, height: window.innerHeight})
}

 return (

<main id = 'main'>
<div className = {styles.homepage_frame} style = {{backgroundColor: selected_book.book == null ? 'whitesmoke' : '#FFF'}}>


<Book_Box 
selected_book = {props.book[0]}
select_book = {select_book}
w={size.width}
h={size.height}
query_cfi = {props.query_cfi}
/>


    </div>
    </main>


)}
export default App


