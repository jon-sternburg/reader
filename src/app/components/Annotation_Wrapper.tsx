'use client'
import { Fragment } from 'react'
import styles from '../css/sidebar_styles.module.css'
import { IoMdTrash } from "react-icons/io"
import { MdEdit } from "react-icons/md"


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
    category?:option_uc
    color?: string
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
type option_uc = {
  label: string
  value: string
}
type A_Props = {
  key: number
  x: Annotation_Item
  selected: boolean
  i: number
  get_annotation: (x: string, i: number) => void
  delete_annotation_pre: (x: string, i: number) => void
  edit_annotation: (x: Annotation_Item) => void
}



export default function Annotation_Wrapper(props: A_Props) {
  let text = props.x.data.text 
  let notes = props.x.data.data 
  let section = props.x.data.section 
  let title = props.x.data.title 
  let time = props.x.data.time
  let cfiRange = props.x.cfiRange 
  let preview = text
  let notes_preview = notes ? notes : ''
  let category = props.x.data.category ? props.x.data.category.label : null
  let title_ = title ? title : 'untitled'
  let color = props.x.data.color

  function element_clicked() {
    props.get_annotation(cfiRange, props.i)
  }


  return (

    <li style ={{listStyleType: 'none'}} className={props.selected ? styles["result_li"] + " " + styles["selected"] : styles["result_li"]}   >
<header>
      <h6 className={props.selected ? styles.selected_title : styles.not_selected_title}>{title_} - <span style={{ fontStyle: 'italic' }}>{time}</span></h6>
      </header>


{category !== null && (<p className={styles.category}>Category: {category}</p>)}
      <Fragment>
      <blockquote style = {{border: `2px solid ${color}`}}>
        {section && section.length > 0 && (
          <p  style={{ fontStyle: 'italic' }}>{section}</p>
        )}
        <p onClick={() => element_clicked()}  style={{ fontStyle: 'italic' }}>...{preview}...</p>

        </blockquote>
        <Fragment>
          {notes_preview && notes_preview.length > 0 && (
            <p className={styles.annotation_notes} >{notes_preview}</p>
          )}


          <div className={styles.annotation_bottom_bar}>
          <button type={"button"} className={styles.view_in_book} onClick={() => element_clicked()}>View</button>
          <button type = {"button"} onClick={() => props.edit_annotation(props.x)} className={styles.edit_annotation}  >  <MdEdit className={styles.edit_annotation_icon}  /> <span>Edit</span></button>
          <button type = {"button"} onClick={() => props.delete_annotation_pre(cfiRange, props.i)} className={styles.delete_annotation} >  <IoMdTrash className={styles.delete_annotation_icon}  /><span>Delete</span></button>
          </div>

        </Fragment>

      </Fragment>
    </li>

  );
}