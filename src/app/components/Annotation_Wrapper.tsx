'use client'
import React, { RefObject, Fragment, useState } from 'react'
import styles from '../css/sidebar_styles.module.css'
import { IoMdTrash } from "react-icons/io"
import { MdEdit } from "react-icons/md"
import { AnnotationData, AnnotationInner } from '../types/sidebar_types'



type A_Props = {
  key: number
  x: AnnotationData
  selected: boolean
  i: number
  get_annotation: (x: string, i: number) => void
  delete_annotation: (x: string, i: number) => void
  edit_annotation: (x: AnnotationData) => void
}



export default function Annotation_Wrapper(props: A_Props) {
  const isAnnotationDataInner_ = (content: string | AnnotationInner): content is AnnotationInner => typeof content == 'object'
  let text = isAnnotationDataInner_(props.x[1]) ? props.x[1].data.text : ''
  let notes = isAnnotationDataInner_(props.x[1]) ? props.x[1].data.data : ''
  let section = isAnnotationDataInner_(props.x[1]) ? props.x[1].data.section : ''
  let title = isAnnotationDataInner_(props.x[1]) ? props.x[1].data.title : ''
  let cfiRange = isAnnotationDataInner_(props.x[1]) ? props.x[1].cfiRange : ''

  let preview = text
  let notes_preview = notes ? notes : ''
  let title_ = title ? title : 'untitled'


  function element_clicked() {
    props.get_annotation(cfiRange, props.i)
  }




  return (

    <div className={props.selected ? styles["result_li"] + " " + styles["selected"] : styles["result_li"]}   >

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
            <IoMdTrash className={styles.delete_annotation} onClick={() => props.delete_annotation(cfiRange, props.i)} />


          </footer>

        </Fragment>

      </Fragment>
    </div>

  );
}