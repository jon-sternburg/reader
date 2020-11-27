
import React, { Component } from 'react'
import '../css/homepage.css'
import Sidebar from './Sidebar'
import Top_Bar_Homepage from './Top_Bar_Homepage'
import Grid from './Grid'
import Book_Box from './Book_Box'
import axios from 'axios'
import ePub from 'epubjs'


var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);


export default class Homepage extends Component {
constructor(props) {
  super(props);
  this.state = { 
  	selected_book: null,
  	book: null,
  	rendition: null,
  };


}

select_book = (book) => this.setState({selected_book: book, show_settings: false})




  render() {
    return <div className = 'homepage_frame' style = {{backgroundColor: this.state.selected_book == null ? 'whitesmoke' : '#FFF'}}>
{this.state.selected_book == null  && ( 
<Top_Bar_Homepage
rendition = {this.state.rendition}
book = {this.state.book} 
select_book = {this.select_book} 
selected_book = {this.state.selected_book}
toc = {this.state.toc} 
/>
)}

{w < 1000 && this.state.selected_book == null  && (
<div className = 'topbar_search_wrap_mobile'>
<form  onSubmit={(e) => e.preventDefault()}  role="search">
    <input 
    id="search_input_homepage_mobile" 
    type="search" 
    placeholder="Search books..." 
    value={this.state.keyvalue}
    onChange={(e) => this.handleInputChange(e.target.value)}
    />
</form>
</div>

)}


{this.state.selected_book == null ? 
<Grid 
select_book = {this.select_book} 
 />
:
<Book_Box 
selected_book = {this.state.selected_book}
select_book = {this.select_book}
/>
}










    </div>
  }
}