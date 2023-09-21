'use client'
import { Fragment } from 'react'
import styles from '../css/sidebar_styles.module.css'
import { IoMdTrash } from "react-icons/io"
import { MdEdit } from "react-icons/md"
 
import { BiLinkAlt } from "react-icons/bi"
type Annotation_Item = {
  cfi?: string
  desc?:string
  page?:string
  quote?:string
  section?:string
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
  sparknotes: boolean
  i: number
  get_annotation: (x: string, i: number) => void
  delete_annotation_pre: (x: string, i: number) => void
  edit_annotation: (x: Annotation_Item) => void
}



export default function Annotation_Wrapper(props: A_Props) {

  let text = props.sparknotes ? props.x.quote : props.x.data.text 
  let source = props.sparknotes? props.x.page : ''
  let notes = props.sparknotes ? props.x.desc : props.x.data.data 
  let section = props.sparknotes ? props.x.section : props.x.data.section 
  let title = props.sparknotes ?  'Important quote' : props.x.data.title ? props.x.data.title  : 'untitled'
  let time = props.sparknotes ? '' : props.x.data.time
  let cfiRange_ = props.sparknotes ? props.x.cfi : props.x.cfiRange 
  let cfiRange = cfiRange_ !== undefined ? cfiRange_ : ''
  let preview = text
  let notes_preview = notes ? notes : ''
  let category = props.sparknotes ? null : props.x.data.category ? props.x.data.category.label : null

  let color = props.sparknotes ? '#2196f3' : props.x.data.color ? props.x.data.color : 'green'

  function element_clicked() {
    props.get_annotation(cfiRange, props.i)
  }

function go_to_source() {
  window.open(source, '_blank', 'noopener,noreferrer')
}

  return (

    <li style ={{listStyleType: 'none'}} className={props.selected ? styles["result_li"] + " " + styles["selected"] : styles["result_li"]}   >
<header>
      <h6 className={props.selected ? styles.selected_title : styles.not_selected_title}>{title}  {props.sparknotes && (<span style={{ fontStyle: 'italic' }}> - {time}</span>)}</h6>
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
          <button aria-label = {"View annotation in book"}  type={"button"} className={styles.view_in_book} onClick={() => element_clicked()}>View</button>
          {!props.sparknotes  ? 
        <Fragment>
          <button aria-label = {"Edit annotation"} type = {"button"} onClick={() => props.edit_annotation(props.x)} className={styles.edit_annotation}  >  <MdEdit className={styles.edit_annotation_icon}  /> <span>Edit</span></button>
          <button aria-label = {"Delete annotation"} type = {"button"} onClick={() => props.delete_annotation_pre(cfiRange, props.i)} className={styles.delete_annotation} >  <IoMdTrash className={styles.delete_annotation_icon}  /><span>Delete</span></button>
          </Fragment>
          :
          <button aria-label = {"Edit annotation"} type = {"button"} onClick={() => go_to_source()} className={styles.edit_annotation}  >  <BiLinkAlt className={styles.edit_annotation_icon}  /> <span>Source</span></button>
          }
          </div>

        </Fragment>

      </Fragment>
    </li>

  );
}