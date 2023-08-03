

import React, { Component, Fragment, useRef, useState, useEffect} from 'react'
//import '../pages/css/top_bar.css'
import styles from '../top_bar_styles.module.css'
import { FaBookOpen } from "react-icons/fa"
import { AiFillHome } from "react-icons/ai"
import { AiFillSetting } from "react-icons/ai"
import _ from 'lodash'
import { MdClose } from "react-icons/md"
import parse from 'html-react-parser';
import ePub from 'epubjs'
import {EpubCFI} from 'epubjs'
import { AiOutlineLeft } from "react-icons/ai"
import { AiOutlineRight } from "react-icons/ai"
import { FaStickyNote } from "react-icons/fa"

let book_data = require('./update_books.json')


export default function Top_Bar_Homepage_Mobile(props) {

const [keyvalue, set_keyvalue] = useState('')
const [results, set_results] = useState([])
const input = useRef();

useEffect(() => {
if (keyvalue !== '') {handleSearchChange()}
}, [keyvalue])

function cancel_search() {
set_results([])
set_keyvalue('')
}

function handleInputChange(keyvalue) {
set_keyvalue(keyvalue)
  }


  function handleSearchChange(e) {
    setTimeout(() => {
      if (keyvalue.length < 1) {
      set_results([])
      set_keyvalue('')
}
    const re = new RegExp(_.escapeRegExp(keyvalue), "i");
    const isMatch_title = (result) => re.test(result.title);
    const isMatch_author = (result) => re.test(result.author)

    let _source = book_data
    let results_title = _.filter(_source, isMatch_title)
    let results_author = _.filter(_source, isMatch_author)
    let results_ = results_title.concat(results_author)

if (keyvalue.length > 2) {
set_results(results_)
}}, 500);
    
}


let title = props.selected_book == null ? 'Reader!' : props.selected_book.title

    return ( 

    <div className = {styles.top_bar_frame}>


<div className = {styles.title_wrap_mobile}>
    <div className = {styles.book_icon_wrap_mobile} >
    <FaBookOpen className = {styles.book_icon_mobile} />
    </div>
    <div className = {styles.title_mobile} >{title}</div>
   </div>

{props.selected_book !== null && (
<div className = {styles.home_button} onClick = {() => props.select_book(null)}> <AiFillHome className = {styles.home} /></div> )}


{results.length > 0    ?

<Fragment>
{props.selected_book == null ? 
<Fragment>
<ul className = {styles.search_results_homepage_mobile}>
{results.map((x, i) => {
return <li key = {x + i} onClick = {() => props.select_book(x)}>
<p>

{x.title}, <span style = {{fontStyle: 'italic'}}> {x.author} </span>

</p>

</li>
})}
</ul>

<div onClick = {() => cancel_search()} className = {styles.cancel_mobile_search}>Cancel search</div>
</Fragment>
: null }
</Fragment>
:  null}




<div className = {styles.header_wrap}>


<div className = {styles.topbar_search_wrap_mobile}>
<form  onSubmit={(e) => e.preventDefault()}  role="search">
    <input 
    id="search_input_homepage" 
    placeholder="Search..." 
    value={keyvalue}
    onChange={(e) => handleInputChange(e.target.value)}
    />
</form>
</div>



  </div>

    </div>
  )
}

