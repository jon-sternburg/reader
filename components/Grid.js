
import React, { Component } from 'react'
import Link from 'next/link'
import styles from '../grid_styles.module.css'
import { GiWhiteBook } from "react-icons/gi"
import { motion, AnimatePresence  } from "framer-motion"
import { BsBook } from "react-icons/bs"
import { AiFillTrophy } from "react-icons/ai"


let book_data = require('./update_books.json')
let featured = require('./featured.json')


export default class Grid extends Component {
/*
componentDidMount() {

console.log('mounted')

featured.map((x, i) => {
  const img = new Image();
  img.src = `/covers/${x.id}.jpg`

	})

}
  */

  render() {
    return <div className = {styles.frame}>




<div className = {styles.featured_frame}>
<span> Popular  </span>

{featured.map((x, i) => {
return <div key = {x + i} className = {styles.grid_box}  style = {{backgroundColor: x.color}} onClick ={() => this.props.select_book(x)}>
<AnimatePresence>
<motion.img
key = {x + i}
     initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        id = {styles.book_img} 
 src = {`/covers/${x.id}.jpg`} />
<div className = {styles.underbox}> 
<div className = {styles.title}>{x.title}</div>
<div className = {styles.author}>{x.author}</div>
</div>
</AnimatePresence>

</div>

})}
</div>





<div className = {styles.featured_frame}>
<span> Classics  </span>
{book_data.map((x, i) => {
return <div key = {x.title + i} className = {styles.grid_box} style = {{backgroundColor: '#fff'}} onClick ={() => this.props.select_book(x)}>
<img id = {styles.book_img} src = {`/covers/${x.id}.jpg`} /> 
{/* <BsBook id = 'grid_book_icon' />
*/}


<div className = {styles.underbox_small}> 
<div className = {styles.title}>{x.title}</div>
<div className = {styles.author}>{x.author}</div>
</div>


</div>
})}
</div>









    </div>
  }
}