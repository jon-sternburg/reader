
import React from 'react'
import styles from '../grid_styles.module.css'
import Image from 'next/image'
import classics from '../data/classics.json'
import popular from '../data/popular.json'

import { MdKeyboardArrowRight } from "react-icons/md"

type G_Props = {
  select_book: (book: BookType | null) => void
  w: number
  h: number
  show_book_list: () => void
  }
  
  type BookType = {
    title: string
    author: string
    url: string
    id: string
    path: string
    height: number
    width: number
    bg: string
    border: string
    color?: string
  }
  type MediaSize = {
    w: number
    h: number
    }
export default function Grid(props:G_Props):JSX.Element {

let img_ann_dim = getMediaSize(1920, 888)


function getMediaSize(iw:number, ih:number):MediaSize {

let new_w = props.w * .6
let new_h = (ih/iw) * new_w
  
  return {
      w: new_w,
      h: new_h
  }
  
  }

  let popular_ = popular.slice(0,6)

    return (
 <div className = {styles.frame}>
<section className = {styles.hero_wrap}>

<div className = {styles.hero_top}>
<h2>Read your favorite eBooks from the Project Gutenberg Library</h2>
<h4>Full annotation, highlight, and text search support</h4>
</div>
{props.w <= 470 && (

<div className = {styles.view_all_books} onClick = {() => props.show_book_list()}>
  <span>View all books</span>
  <MdKeyboardArrowRight className = {styles.view_all_books_icon} />
  </div>


)}
</section>






<section className = {styles.featured_frame}>

  {/* 
<h2>Popular Books</h2>
*/}
{popular.map((x, i) => {
return <article key = {x.title + i} className = {styles.grid_box}  style = {{backgroundColor: x.bg}} onClick ={() => props.select_book(x)}>

<Image
alt = {`book cover for ${x.title}`} 
className = {styles.book_img} 
src = {`/covers/${x.id}.jpg`}
height = {140}
width = {100}
style = {{ border: `2px solid ${x.border}`}}
 />

<header className = {styles.underbox}> 
<h4 className = {styles.title}>{x.title}</h4>
<h5 className = {styles.author}>{x.author}</h5>
</header>


</article>

})}
</section>



{/* 

<section className = {styles.featured_frame}>
<h2>Classics</h2>
{classics.map((x, i) => {
return <article key = {x.title + i} className = {styles.grid_box} style = {{backgroundColor: x.bg, border: `2px solid ${x.border}`}} onClick ={() => props.select_book(x)}>
<Image
alt = {`book cover for ${x.title}`} 
className = {styles.book_img} 
src = {`/covers/${x.id}.jpg`}
height = {140}
width = {100}
 />
<header className = {styles.underbox}> 
<h4 className = {styles.title}>{x.title}</h4>
<h5 className = {styles.author}>{x.author}</h5>
</header>


</article>
})}
</section>

*/}






    </div>
  )
}