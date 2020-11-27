
import React, { Component, Fragment, PureComponent} from 'react'
import '../css/top_bar.css'
import { FaBookOpen } from "react-icons/fa"
import { AiFillHome } from "react-icons/ai"
import { AiFillSetting } from "react-icons/ai"
import _ from 'lodash'
import { MdClose } from "react-icons/md"
import ReactHtmlParser from 'react-html-parser';
import ePub from 'epubjs'
import {EpubCFI} from 'epubjs'
import { AiOutlineLeft } from "react-icons/ai"
import { AiOutlineRight } from "react-icons/ai"
import { FaStickyNote } from "react-icons/fa"

var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);


let book_data = require('./update_books.json')

export default class Top_Bar_Book extends Component {
constructor(props) {
  super(props);
  this.state = { 
    keyvalue: '',
    value: '',
    results: [],
    el_range: null,
    el_cfi: null,
    si: null,
    mark_id: null,
    mark_count: 0

  };


}



  render() {
let title = this.props.selected_book == null ? 'Reader' : this.props.selected_book.title

    return <div className = 'top_bar_frame'>


<div className = 'title_wrap'>
    <div className = 'book_icon_wrap' onClick = {() => this.props.select_book(null)}>
    <FaBookOpen id = 'book_icon' />
    </div>
    <div id = 'title' onClick = {() => this.props.selected_book == null ? this.props.select_book(null) : {}}>{title}</div>
   </div>


    <div id = 'home_button'onClick = {() => this.props.select_book(null)}> 
    <AiFillHome id = 'home' />
    </div>

<div className = 'header_wrap'>


{w > 1000 && ( 
<div className = 'topbar_search_wrap' role="search">
<form onSubmit={(e) => this.props.handle_text_submit(e)} >
    <input 
    id="search_text_book"  
    value={this.props.keyvalue}
    placeholder="Search text..." 
    onChange={(e) => this.props.handleInputChange_text(e.target.value)}
    />
</form>
{this.props.results.length > 0 && (<MdClose id = 'quit_search' onClick = {() => this.props.clear_input()}/>)}
</div>
)}


  </div>

    </div>
  }
}

const Result_Text = (kv, arr) => {


return arr.map(x => {
return <li>{x}<span id ='hl'>{kv}</span></li>



})
}