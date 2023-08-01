import React, {Fragment, useState, useEffect, useRef, useCallback  } from "react";
import Homepage from '../components/Homepage'
import { useRouter } from 'next/router'
import all_book_data from '../components/all_book_data.json'
var qs = require('qs');


const App = (props) => {
const [size, set_dim] = useState({width: 0, height: 0})
const [book_query, set_book_query] = useState({data: 'not_set', loc: null})
const router = useRouter()

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
set_book_query({data: book_[0], loc: test.cfi ? test.cfi : null})
} else {
set_book_query({data: null, loc: null})
}
}, [])




function updateDimensions() {
set_dim({width: window.innerWidth, height: window.innerHeight})
}

 return (
<Fragment>
{book_query.data !== 'not_set' && (
<Homepage size = {size} book_query = {book_query.data} loc_query = {book_query.loc} />
)}
</Fragment>
)}
export default App

