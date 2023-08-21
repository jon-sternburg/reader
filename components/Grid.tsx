
import React from 'react'
import styles from '../grid_styles.module.css'
import Image from 'next/image'
import book_data from '../data/update_books.json'
import featured from '../data/featured.json'

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
    color?: string
  }

export default function Grid(props:G_Props):JSX.Element {


    return (

      <div className = {styles.frame}>




<section className = {styles.featured_frame}>
<h2>Popular Books</h2>

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
<h2>Classics</h2>
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