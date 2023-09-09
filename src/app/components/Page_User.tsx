'use client'
import React, { Fragment, useState, useEffect, useRef } from "react";
import styles from '../css/homepage_styles.module.css'
import Top_Bar_Homepage_Mobile from './Top_Bar_Homepage_Mobile'
import Sidebar_Homepage from './Sidebar_Homepage'

import { IoMdTrash } from "react-icons/io"
import { MdEdit, MdOutlineExpandMore, MdOutlineExpandLess } from "react-icons/md"
import getTimeStamp from '../util/getTimeStamp'
import { useRouter } from 'next/navigation'
import { AiFillHome } from "react-icons/ai"
import { useSession, signOut } from 'next-auth/react';
type Size = {
  width: number
  height: number
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
}

export default function User_Page(): JSX.Element {
  const [size, set_dim] = useState<Size>({ width: 0, height: 0 })
  const [book_list, set_book_list] = useState<boolean>(false)
  const [logged_in, toggle_login] = useState<boolean>(true)
  const [user_data, set_user_data] = useState<User_Data | null>(null)
  const [edit, set_edit] = useState<Edit_State>({ show: false, annotation: null, book: null })
  const { data: session } = useSession()
  const router = useRouter()
  useEffect(() => {
    window.addEventListener('resize', updateDimensions);

    async function fetch_data(id: string) {
      return await fetch(`/api/user?user_id=${id}`, { method: 'GET', })
        .then((res) => res.json())
        .then((data) => { console.log('fetched data (useeffect): ', data); set_user_data(data) })
        .catch(err => {
          console.log(err)
          set_user_data(null)
        })
    }
    function updateDimensions() {
      set_dim({ width: window.innerWidth, height: window.innerHeight })
    }

    fetch_data(session?.user._id ? session?.user._id : '')

    updateDimensions()
    return () => window.removeEventListener('resize', updateDimensions);

  }, [session?.user._id])


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


  return (
    <Fragment>

      {size.width > 0 && (
        <main className={styles.main}>
          {size.width < 1000 && (<Top_Bar_Homepage_Mobile show_book_list={show_book_list} book_list={book_list} logged_in={logged_in} />)}

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
                             <button type = {'button'} className = {styles.sign_out_top} onClick = {() =>  handle_signout()}>Sign out</button>
                             <button type = {'button'} className = {styles.user_page_home_button}>
                    <AiFillHome className={styles.user_icon} onClick={() => router.push('/')} />
                    </button>
                  </nav>
                )}

                {edit.show && edit.annotation !== null && edit.book !== null && (<Edit_Window annotation={edit.annotation} cancel_annotation={cancel_annotation} book={edit.book} user_id={session?.user._id ? session?.user._id : ''} />)}


                <header>
                  <h1>My Account</h1>
                </header>

                <div className={styles.greeting_wrap}>
                  <h3>Hello, {session?.user.email}</h3>
                </div>


               
                  <section className={styles.user_book_list}>
                    <h2 className={styles.my_books}>My Books</h2>


                    {user_data !== null ?  
                    <Fragment>
                    {user_data.books.length > 0 && (user_data.books.map((x, i) => <Book_Item key={i} book_item={x} edit_annotation={edit_annotation} user_id={session?.user._id ? session?.user._id : ''} reset_user_data={reset_user_data} />))}
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

type Annotation_Item = {
  type: string
  cfiRange: string
  data: {
    text: string
    data: string
    section: string
    time: string
    title: string
    epubcfi: string
  }
  sectionIndex: number
  mark?: {
    element: null
    className: string
    data: {
      text: string
      data: string
      section: string
      time: string
      title: string
      epubcfi: string
    }
    attributes: {
      fill: string
      'fill-opacity': string
      'mix-blend-mode': string
    }
  }
}

type Book_Item = {
  annotations: [Annotation_Item]
  createdAt: string
  id: string
  name: string
  _id: string
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


  async function delete_set_book_data(x: Set_Book_Data_Params) {

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

<button type = {"button"} onClick = {() => delete_annotation()}>Delete</button>
<button type = {"button"} onClick = {() => cancel_prompt()}>Cancel</button>

</div>

</div>

)}

    <article className={styles.annotation_item} >
<header>
      <h6>{title} - <span style={{ fontStyle: 'italic' }}>{time}</span></h6>
      </header>
      <blockquote>
        <p>{section}</p>
        <p>{text}</p>
      </blockquote>
      <p>{notes}</p>
      <footer className={styles.annotation_bottom_bar}>
        <button type={"button"} onClick={() => view_in_book()}>View in book</button>
        <MdEdit className={styles.edit_annotation} onClick={() => props.edit_annotation(y, book)} />
        <IoMdTrash className={styles.delete_annotation} onClick={() => delete_annotation_pre(y)} />


      </footer>
    </article>
    </Fragment>
  )
}


type EW_Props = {
  annotation: Annotation_Item
  cancel_annotation: () => void
  book: Book_Item
  user_id: string

}


type Set_Book_Data_Params = {
  id: string
  name: string
  annotations: Annotation_Item[]
  user_id: string
  edit: boolean
}

function Edit_Window(props: EW_Props) {

  const textarea_ref = useRef<HTMLTextAreaElement | null>(null);
  const input_ref = useRef<HTMLInputElement | null>(null);

  let x = props.annotation
  let text = x.data.text
  let section = x.data.section

  useEffect(() => {

    if (textarea_ref.current !== null && textarea_ref.current !== undefined) {
      textarea_ref.current.value = x.data.data
    }
    if (input_ref.current !== null && input_ref.current !== undefined) {
      input_ref.current.value = x.data.title
    }



  }, [x.data.data, x.data.title])


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
        props.cancel_annotation()
      })
      .catch(err => {
        console.log(err)
        props.cancel_annotation()
      })

  }

  async function save_annotation() {
    let time = getTimeStamp()

    let annotation = props.annotation
    let annotations = [...props.book.annotations]
    let matching_index = annotations.findIndex(x => x.cfiRange == annotation.cfiRange)

    annotations[matching_index].data.title = input_ref.current !== null && input_ref.current !== undefined ? input_ref.current.value : ''
    annotations[matching_index].data.data = textarea_ref.current !== null && textarea_ref.current !== undefined ? textarea_ref.current.value : ''
    annotations[matching_index].data.time = time


    set_book_data({ id: props.book.id, name: props.book.name, annotations: annotations, user_id: props.user_id, edit: true })



  }


  return (


    <section className={styles.annotation_text_wrap}  >
      <div className={styles.annotation_edit_quote_wrap}>
        <blockquote>
          <p>{section}</p>
          <p>{text}</p>
        </blockquote>
      </div>

      <div className={styles.annotation_title_wrap}>
        <input ref={input_ref} className={styles.title_input_search} placeholder="Title..." name="annotation_title_search" type="text" />
      </div>
      <div className={styles.annotation_text_wrap_inner}>
        <textarea ref={textarea_ref} className={styles.textarea_id} placeholder={'Notes...'} />
      </div>
      <div className={styles.button_wrap}>
        <div className={styles.save} onClick={() => save_annotation()}>Save</div>
        <div className={styles.cancel} onClick={() => props.cancel_annotation()}>Cancel</div>
      </div>
    </section>

  )


}