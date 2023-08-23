
import React from 'react'
import styles from '../grid_styles.module.css'
import Image from 'next/image'
import classics from '../data/classics.json'
import popular from '../data/popular.json'

type G_Props = {
  select_book: (book: BookType | null) => void
  w: number
  h: number
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

let img_ann_dim = getMediaSize(1307, 888)
let img_search_dim = getMediaSize(1307, 888)

function getMediaSize(iw:number, ih:number):MediaSize {

let new_w = props.w * .4
let new_h = (ih/iw) * new_w
  
  return {
      w: new_w,
      h: new_h
  }
  
  }

    return (

      <div className = {styles.frame}>


<section className = {styles.hero_wrap}>

<div className = {styles.hero_top}>

  {/* 
<img className = {styles.hero_img_book} src = {'./images/book.png'} height = {67} width = {59} />
*/}
<h2>Read your favorite eBooks from the Project Gutenberg Library</h2>
<h4>Full annotation, highlight, and text search support</h4>
</div>
<div className = {styles.hero_bottom}>
<img alt = {"image showing annotation feature"} className = {styles.hero_img} src = {'./images/Annotation_Image.png'} height = {img_ann_dim.h} width = {img_ann_dim.w}/>
<img alt = {"image showing search feature"} className = {styles.hero_img} src = {'./images/Search_Image.png'} height = {img_search_dim.h} width = {img_search_dim.w} />
</div>
</section>


<section className = {styles.featured_frame}>
<h2>Popular Books</h2>

{popular.map((x, i) => {
return <article key = {x.title + i} className = {styles.grid_box}  style = {{backgroundColor: x.bg, border: `2px solid ${x.border}`}} onClick ={() => props.select_book(x)}>

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









    </div>
  )
}