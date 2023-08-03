
import React, { Component } from 'react'
import Link from 'next/link'
import styles from '../grid_styles.module.css'
import { GiWhiteBook } from "react-icons/gi"
import Image from 'next/image'
import { BsBook } from "react-icons/bs"
import { AiFillTrophy } from "react-icons/ai"

let all_book_data = require('./all_book_data.json')

let book_data = require('./update_books.json')
let featured = require('./featured.json')


export default function Grid(props) {


/*
Promise.all(all_book_data.map(x => {
return new Promise((resolve, reject) => {
const img = new Image();
img.src = `/covers/${x.id}.jpg`
img.onload = () => {

    let data_ = {
        ...x,
    height: img.height,
    width: img.width
}

resolve(data_)
}



})





})).then((covers) => {

 console.log(JSON.stringify(covers))

 })

*/

    return (

      <div className = {styles.frame}>




<section className = {styles.featured_frame}>
<h2> Popular  </h2>

{featured.map((x, i) => {
return <article key = {x.title + i} className = {styles.grid_box}  style = {{backgroundColor: x.color}} onClick ={() => props.select_book(x)}>

<Image
alt = {`book cover for ${x.title}`} 
className = {styles.book_img} 
src = {`/covers/${x.id}.jpg`}
height = {x.height}
width = {x.width}
 />

<header className = {styles.underbox}> 
<h4 className = {styles.title}>{x.title}</h4>
<h5 className = {styles.author}>{x.author}</h5>
</header>


</article>

})}
</section>





<section className = {styles.featured_frame}>
<h2> Classics  </h2>
{book_data.map((x, i) => {
return <article key = {x.title + i} className = {styles.grid_box} style = {{backgroundColor: '#fff'}} onClick ={() => props.select_book(x)}>
<Image
alt = {`book cover for ${x.title}`} 
className = {styles.book_img} 
src = {`/covers/${x.id}.jpg`}
height = {x.height}
width = {x.width}
 />
<header className = {styles.underbox_small}> 
<h4 className = {styles.title}>{x.title}</h4>
<h5 className = {styles.author}>{x.author}</h5>
</header>


</article>
})}
</section>









    </div>
  )
}