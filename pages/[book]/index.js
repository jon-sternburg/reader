import React, {Fragment, useState, useEffect, useRef, useCallback  } from "react";
import Homepage from '../../components/Homepage'

const all_book_data = require('../../components/all_book_data.json')


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

const App = (props) => {
const [size, set_dim] = useState({width: 0, height: 0})


useEffect(() => {
window.addEventListener('resize', updateDimensions);
updateDimensions()
return () => window.removeEventListener('resize', updateDimensions);
}, [])


function updateDimensions() {
set_dim({width: window.innerWidth, height: window.innerHeight})
}

 return (

<Homepage size = {size} book_query = {props.book[0]}/>

)}
export default App
