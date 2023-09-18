'use client'
import { Fragment, useState, useEffect } from "react";
import styles from '../css/homepage_styles.module.css'
import Top_Bar_Homepage_Mobile from './Top_Bar_Homepage_Mobile'
import Sidebar_Homepage from './Sidebar_Homepage'
import Sidebar_New_Annotation from "./Sidebar_New_Annotation";
import { IoMdTrash } from "react-icons/io"
import { MdEdit, MdOutlineExpandMore, MdOutlineExpandLess } from "react-icons/md"
import getTimeStamp from '../util/getTimeStamp'
import { useRouter } from 'next/navigation'
import { AiFillHome } from "react-icons/ai"
import { signOut } from 'next-auth/react';
import { Annotation_Item } from '../types/book_box_types'



type Size = {
  width: number
  height: number
}

type default_uc = option_uc[]

type option_uc = {
  label: string
  value: string
}
type Edit_State = {
  show: boolean
  annotation: Annotation_Item | null
  book: Book_Item | null
}

type User_Data = {
  books: [Book_Item]
  createdAt: string
  email: string
  role: string
  __v: number
  _id: string
  user_categories: default_uc
}

type PU_Props = {
  user_data: User_Data
  email: string
  user_id: string
}




export default function Page_User(props: PU_Props): JSX.Element {
  const [size, set_dim] = useState<Size>({ width: 0, height: 0 })
  const [book_list, set_book_list] = useState<boolean>(false)
  const [user_data, set_user_data] = useState<User_Data | null>(null)
  const [edit, set_edit] = useState<Edit_State>({ show: false, annotation: null, book: null })
  const router = useRouter()

  useEffect(() => {
    window.addEventListener('resize', updateDimensions);

    function updateDimensions() {
      set_dim({ width: window.innerWidth, height: window.innerHeight })
    }

    updateDimensions()
    return () => window.removeEventListener('resize', updateDimensions);

  }, [])


  useEffect(() => {

console.log('setting user_data', props.user_data)
set_user_data(props.user_data)

  }, [props.user_data])

  function show_book_list() {
    set_book_list(!book_list)
  }

  function edit_annotation(annotation: Annotation_Item, book: Book_Item) {
    set_edit({ show: true, annotation: annotation, book: book })
  }


  
  function reset_user_data(x: User_Data) {
    set_user_data(x)
  }

  function cancel_annotation() {
    set_edit({ show: false, annotation: null, book: null })
  }

  async function handle_signout() {
    await signOut({callbackUrl: process.env.NEXT_PUBLIC_CB_URL})
  }


  async function set_book_data(x: Set_Book_Data_Params) {
    console.log('setting db data after save => ', x)
    return await fetch("/api/book", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(x)
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('set_book_data response => ', data)
        reset_user_data(data)
       cancel_annotation()
      })
      .catch(err => {
        console.log(err)
        cancel_annotation()
      })

  }



function handle_save_annotation(picked_category: option_uc | null, color: string, edit_:Annotation_Item | null, ta_val: string, input_val: string) {

    let time = getTimeStamp()

    if (edit.book !== null && edit.annotation !== null && user_data !== null) {
    let annotation = edit.annotation
    let annotations = [...edit.book.annotations]
    let matching_index = annotations.findIndex(x => x.cfiRange == annotation.cfiRange)

    annotations[matching_index].data.title = input_val
    annotations[matching_index].data.data = ta_val
    annotations[matching_index].data.time = time
    annotations[matching_index].data.color = color

    if (picked_category !== null) {   annotations[matching_index].data.category = picked_category }
    let uc = picked_category == null || edit.book.user_categories.filter(x => x.label.toLowerCase() == picked_category.label.toLowerCase()).length > 0 ? edit.book.user_categories : [...edit.book.user_categories, picked_category]
    set_book_data({ id: edit.book.id, name: edit.book.name, annotations: annotations, user_id: props.user_id, edit: true, user_categories: uc })
    }


}


function handle_cancel_annotation() {

  console.log('handle cancel!')
  set_edit({ show: false, annotation: null, book: null })
}

  return (
    <Fragment>

      {size.width > 0 && (
        <main className={styles.main}>
          {size.width < 1000 && (<Top_Bar_Homepage_Mobile show_book_list={show_book_list} book_list={book_list} logged_in={true} />)}

          <section className={styles.homepage_frame} style={{ backgroundColor: 'whitesmoke' }}>
            <Fragment>
              {size.width >= 1000 || book_list ?
                <Sidebar_Homepage
                  w={size.width}
                  h={size.height}
                  book_list={book_list}
                />
                : null
              }
 

              <section className={styles.user_info_wrap}>

                {size.width >= 1000 && (
                  <nav className={styles.user_top_bar}>
                             <button aria-label = {"Sign out"} type = {'button'} className = {styles.sign_out_top} onClick = {() =>  handle_signout()}>Sign out</button>
                             <button aria-label = {"Home"} type = {'button'} className = {styles.user_page_home_button}>
                    <AiFillHome className={styles.user_icon} onClick={() => router.push('/')} />
                    </button>
                  </nav>
                )}

                {edit.show && edit.annotation !== null && edit.book !== null && user_data !== null && (
                
               <div className={styles.annotation_text_wrap}  >
               <Sidebar_New_Annotation 
               user_categories = {edit.book.user_categories} 
               handle_save_annotation={handle_save_annotation} 
               handle_cancel_annotation={handle_cancel_annotation}
               edit={edit.annotation}
               />
               </div>
                )}


                <header>
                  <h1>My Account</h1>
                </header>

                <div className={styles.greeting_wrap}>
                  <h3>Hello, {props.email}</h3>
                </div>


               
                  <section className={styles.user_book_list}>
                    <h2 className={styles.my_books}>My Books</h2>


                    {user_data !== null ?  
                    <Fragment>
                    {user_data.books.length > 0 && (props.user_data.books.map((x, i) => <Book_Item key={i} book_item={x} edit_annotation={edit_annotation} user_id={props.user_id} reset_user_data={reset_user_data} />))}
                    </Fragment>
                    :
                      
                    <div style = {{marginLeft: '10px'}}>You don&apos;t have any saved annotations.</div>
                    }
                  
                  </section>

            
              </section>
            </Fragment>

          </section>
        </main>
      )}
      <style jsx global>{`
      body {
        margin: 0px;
        padding: 0px;
      }
    `}</style>
    </Fragment>
  )

}


type BI_Props = {
  book_item: Book_Item
  edit_annotation: (annotation: Annotation_Item, book: Book_Item) => void
  reset_user_data: (x: User_Data) => void
  user_id: string
}


type Book_Item = {
  annotations: [Annotation_Item]
  createdAt: string
  id: string
  name: string
  _id: string
  user_categories: default_uc
}

function Book_Item(props: BI_Props) {
  const [show, toggle_annotations] = useState<boolean>(false)
  const x = props.book_item

  function handle_toggle() {
    toggle_annotations(!show)
  }


  let annotation_list = x.annotations.length > 1 ? x.annotations.slice(1) : x.annotations
  let view_more_text = annotation_list.length == 1 ? 'View 1 more annotation' : `View ${x.annotations.length - 1} more annotations`
  return (

    <article className={styles.book_item}>
      <header className={styles.book_item_title} onClick={() => handle_toggle()}>

        {!show ? <MdOutlineExpandMore className={styles.book_item_expand_icon} /> : <MdOutlineExpandLess className={styles.book_item_expand_icon} />}
        <h3>{x.name} <span>({x.annotations.length})</span></h3>
      </header>
      <section className={styles.annotations_wrapper}>

        {x.annotations.length > 0 && (

          <Annotation annotation={x.annotations[0]} edit_annotation={props.edit_annotation} book={x} user_id={props.user_id} reset_user_data={props.reset_user_data} />

        )}
        {show && x.annotations.length > 1 && (annotation_list.map((y, i_) => <Annotation
          key={i_}
          annotation={y}
          i={i_}
          book={x}
          user_id={props.user_id}
          edit_annotation={props.edit_annotation}
          reset_user_data={props.reset_user_data}
        />
        ))}
        {x.annotations.length > 1 && !show && (<div onClick={() => handle_toggle()} className={styles.show_more_annotations}>{view_more_text}</div>)}

      </section>
    </article>

  )
}

type A_Props = {
  key?: number
  annotation: Annotation_Item
  i?: number
  book: Book_Item
  user_id: string
  edit_annotation: (annotation: Annotation_Item, book: Book_Item) => void
  reset_user_data: (x: User_Data) => void



}


type DP_State = {
show: boolean
to_delete: Annotation_Item | null
}


function Annotation(props: A_Props) {
  const router = useRouter()

  const [delete_prompt, toggle_delete_prompt] = useState<DP_State>({show: false, to_delete: null})
  let book = props.book
  let y = props.annotation
  let text = y.data.text
  let section = y.data.section
  let time = y.data.time
  let title = y.data.title == '' ? 'untitled' : y.data.title
  let notes = y.data.data
  let color = y.data.color


  async function delete_set_book_data(x: Delete_Book_Data_Params) {

    console.log('setting db data after save => ', x)
    return await fetch("/api/book", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(x)
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('set_book_data response => ', data)
        toggle_delete_prompt({show: false, to_delete: null})
        props.reset_user_data(data)
      })
      .catch(err => {
        console.log(err)
      })

  }


  function delete_annotation() {

    let annotation = delete_prompt.to_delete
    let annotations = [...props.book.annotations]
    let filtered = annotations.filter(x => {

    let a_ = annotation !== null ? annotation.cfiRange : ''
   return x.cfiRange !== a_

    })


    delete_set_book_data({ id: book.id, name: book.name, annotations: filtered, user_id: props.user_id, edit: true })

  }

  function view_in_book() {

    router.push(`/book/${book.id}?cfi=${y.cfiRange}`)


  }

  function delete_annotation_pre(annotation: Annotation_Item) {

toggle_delete_prompt({show: true, to_delete: annotation})


  }


  function cancel_prompt() {
    toggle_delete_prompt({show: false, to_delete: null})

  }
  return (

    <Fragment>

{delete_prompt.show && (

<div className = {styles.delete_prompt_frame}>
<p>Are you sure you want to delete this annotation?</p>
<div className = {styles.bottom_buttons}>

<button aria-label = {"Confirm delete annotation"} type = {"button"} onClick = {() => delete_annotation()}>Delete</button>
<button aria-label = {"Confirm cancel annotation"} type = {"button"} onClick = {() => cancel_prompt()}>Cancel</button>

</div>

</div>

)}

    <article className={styles.annotation_item} >
<header>
      <h6>{title} - <span style={{ fontStyle: 'italic' }}>{time}</span></h6>
      </header>
      <blockquote style = {{border: `2px solid ${color}`}}>
        <p>{section}</p>
        <p>{text}</p>
      </blockquote>
      <p>{notes}</p>
      <footer className={styles.annotation_bottom_bar}>
        <button aria-label = {"View annotation in book"} type={"button"} onClick={() => view_in_book()}>View</button>

        <button aria-label = {"Edit annotation"} type = {"button"} onClick={() => props.edit_annotation(y, book)} className={styles.edit_annotation}  >  <MdEdit className={styles.edit_annotation_icon}  /> <span>Edit</span></button>
          <button aria-label = {"Delete annotation"} type = {"button"} onClick={() => delete_annotation_pre(y)} className={styles.delete_annotation} >  <IoMdTrash className={styles.delete_annotation_icon}  /><span>Delete</span></button>



      </footer>
    </article>
    </Fragment>
  )
}



type Set_Book_Data_Params = {
  id: string
  name: string
  annotations: Annotation_Item[]
  user_id: string
  edit: boolean
  user_categories: default_uc
}

type Delete_Book_Data_Params = {
  id: string
  name: string
  annotations: Annotation_Item[]
  user_id: string
  edit: boolean
}

