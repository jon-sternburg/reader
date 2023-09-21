import { Annotation } from '../node_modules/epubjs/types/annotations'
import RenditionType from '../node_modules/epubjs/types/rendition'
import SectionType from '../node_modules/epubjs/types/section'
import { ActionMeta, StylesConfig } from 'react-select';
import {Annotation_Item} from './book_box_types'

export type TextSizeState = {
  value: string
  label: string
}

export type SidebarState = null | 'toc' | 'settings' | 'annotations' | 'new_annotation' | 'mobile_search' | 'menu' | 'search' | 'sparknotes'

export type NavItem = {
  id: string,
  href: string,
  label: string,
  subitems?: Array<NavItem | []>,
  parent?: string
}
export type TextSearchResultsData = {
  cfi: string;
  excerpt: string;
}


export type EditDraftCfiType = (string | AnnotationInner)[]
//export type DraftCfiType = null | string | EditDraftCfiType
export type DraftCfiType = null | string | Annotation_Item
export type AnnotationData = (string | AnnotationInner)[]

export type AnnotationInner = {
  type: string,
  cfiRange: string,
  data: {
    data: string
    epubcfi?: string
    section: string
    text: string
    time: string
    title: string
  },
  sectionIndex?: number,
  cb?: Function,
  className?: string,
  styles?: object
}

export type ResultsState = [] | ResultsData[]

export type RS_Option = {
  label: string
  value: string

}

export type ResultsData = {
  label: string
  s: TextSearchResultsData[] | []
  sd: string
  x: SectionType
}


type default_uc = option_uc[]

type option_uc = {
  label: string
  value: string
}
export type S_Props = {
  annotations: Annotation_Item[] | []
  book_title: string
  sidebar: SidebarState
  set_sidebar: (x: SidebarState) => void
  toc: (NavItem | [])[]
  w: number
  logged_in: boolean
  user_categories: default_uc
  email: string | null
  mobile_search: JSX.Element
  rendition: RenditionType
  get_context: (x: TextSearchResultsData, i: number, mobile: boolean) => void
  toggle_flow: () => void
  toggle_spread: () => void
  set_text_size: (option: RS_Option | null, actionMeta: ActionMeta<RS_Option>) => void
  text_size: TextSizeState
  delete_annotation: (x: string, i: number) => void
  set_location: (x: string) => void
  spread: 'auto' | 'none'
  flow: 'paginated' | 'scrolled'
  keyvalue: string
  get_annotation: (x: string, i: number) => void
  results: ResultsState
  si: number | null
  save_annotation: (picked_category: option_uc | null, color: string, edit: Annotation_Item | null, ta_val: string, input_val: string) => void
  cancel_annotation: () => void
  clear_input: () => void
  sparknotes_annotations: SparkType[] | undefined
}


type SparkType = {
  cfi: string
  quote: string
  desc: string
  page: string
  }