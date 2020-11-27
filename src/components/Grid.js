
import React, { Component } from 'react'
import '../css/grid.css'
import { GiWhiteBook } from "react-icons/gi"
import { motion, AnimatePresence  } from "framer-motion"
import { BsBook } from "react-icons/bs"
import { AiFillTrophy } from "react-icons/ai"
//<AiFillTrophy id = 'trophy' />
let book_data = require('./update_books.json')
let featured = require('./featured.json')
export default class Grid extends Component {

componentDidMount() {


featured.map((x, i) => {
  const img = new Image();
  img.src = `/covers/${x.id}.jpg`

	})
}


  render() {
    return <div className = 'frame'>




<div className = 'featured_frame'>
<span> Popular  </span>

{featured.map((x, i) => {
return <div key = {x + i} className = 'grid_box'  style = {{backgroundColor: x.color}}  onClick ={() => this.props.select_book(x)}>
<AnimatePresence>
<motion.img
key = {x + i}
     initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
 src = {`/covers/${x.id}.jpg`} />
<div className = 'underbox'> 
<div className = 'title'>{x.title}</div>
<div className = 'author'>{x.author}</div>
</div>
</AnimatePresence>
</div>
})}
</div>





<div className = 'featured_frame'>
<span> Classics  </span>
{book_data.map((x, i) => {
return <div key = {x.title + i} className = 'grid_box_small'  style = {{backgroundColor: '#fff'}} onClick ={() => this.props.select_book(x)}>
{/* <img src = {`/covers/${x.id}.jpg`} /> */}
<BsBook id = 'grid_book_icon' />



<div className = 'underbox_small'> 
<div className = 'title'>{x.title}</div>
<div className = 'author'>{x.author}</div>
</div>


</div>
})}
</div>









    </div>
  }
}