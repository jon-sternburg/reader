'use client'
import styles from '../css/grid_styles.module.css'
import popular from '../data/popular.json'
import { MdKeyboardArrowRight } from "react-icons/md"
import { useRouter } from 'next/navigation';
import Top_Bar_Homepage from './Top_Bar_Homepage'

type G_Props = {
  w: number
  h: number
  show_book_list: () => void
  logged_in: boolean
  email: string | null
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



export default function Grid(props: G_Props): JSX.Element {

const router = useRouter()

function select_book(x:BookType){
router.push(`/book/${x.id}`)
}



  return (
    <div className={styles.frame}>

{props.w >= 1000 && (
        <Top_Bar_Homepage
        email={props.email}
        logged_in={props.logged_in}
        />
)}



      <section className={styles.hero_wrap}>

        <div className={styles.hero_top}>
          <h2>Read your favorite eBooks from the Project Gutenberg Library</h2>
          <h4>Full annotation, highlight, and text search support</h4>
        </div>
        {props.w <= 1000 && (

          <div className={styles.view_all_books} onClick={() => props.show_book_list()}>
            <span>View all books</span>
            <MdKeyboardArrowRight className={styles.view_all_books_icon} />
          </div>


        )}
      </section>

      <section className={styles.featured_frame}>
        {popular.map((x, i) => {
          return <article key={x.title + i} className={styles.grid_box} style={{ backgroundColor: x.bg }} onClick={() => select_book(x)}>

            <img
              alt={`book cover for ${x.title}`}
              className={styles.book_img}
              src={`/covers/${x.id}.jpg`}
              height={140}
              width={100}
              style={{ border: `2px solid ${x.border}` }}
            />

            <header className={styles.underbox}>
              <h4 className={styles.title}>{x.title}</h4>
              <h5 className={styles.author}>{x.author}</h5>
            </header>


          </article>

        })}
      </section>

    </div>
  )
}