'use client'
import React, { RefObject, Fragment, useState } from 'react'
import styles from '../css/sidebar_styles.module.css'
import { IoMdTrash } from "react-icons/io"
import { MdEdit } from "react-icons/md"
import { AnnotationData, AnnotationInner } from '../types/sidebar_types'

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
  const isAnnotationDataInner_ = (content: string | AnnotationInner): content is AnnotationInner => typeof content == 'object'
  let text = props.x.data.text //isAnnotationDataInner_(props.x[1]) ? props.x[1].data.text : ''
  let notes = props.x.data.data //isAnnotationDataInner_(props.x[1]) ? props.x[1].data.data : ''
  let section = props.x.data.section //isAnnotationDataInner_(props.x[1]) ? props.x[1].data.section : ''
  let title = props.x.data.title //isAnnotationDataInner_(props.x[1]) ? props.x[1].data.title : ''
  let cfiRange = props.x.cfiRange //isAnnotationDataInner_(props.x[1]) ? props.x[1].cfiRange : ''

  let preview = text
  let notes_preview = notes ? notes : ''
  let title_ = title ? title : 'untitled'


  function element_clicked() {
    props.get_annotation(cfiRange, props.i)
  }




  return (

    <article className={props.selected ? styles["result_li"] + " " + styles["selected"] : styles["result_li"]}   >

      <h3 className={props.selected ? styles.selected_title : styles.not_selected_title}>{title_}</h3>


      <Fragment>
        {section && section.length > 0 && (
          <p className={styles.section} style={{ fontStyle: 'italic' }}>{section}</p>
        )}
        <p onClick={() => element_clicked()} className={styles.preview} style={{ fontStyle: 'italic' }}>...{preview}...</p>
        <Fragment>
          {notes_preview && notes_preview.length > 0 && (
            <p className={styles.annotation_notes} >{notes_preview}</p>
          )}


          <footer className={styles.annotation_bottom_bar}>
            <MdEdit className={styles.edit_annotation} onClick={() => props.edit_annotation(props.x)} />
            <IoMdTrash className={styles.delete_annotation} onClick={() => props.delete_annotation_pre(cfiRange, props.i)} />


          </footer>

        </Fragment>

      </Fragment>
    </article>

  );
}