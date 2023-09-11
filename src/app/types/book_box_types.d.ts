import SectionType from '../node_modules/epubjs/types/section'
import Spine from '../node_modules/epubjs/types/spine'
import RenditionType from '../node_modules/epubjs/types/rendition'
import BookEpubType from '../node_modules/epubjs/types/book'
import ContentsType from '../node_modules/epubjs/types/contents'

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


export type BookType = {
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

export type BB_Props = {
  selected_book: BookType
 // select_book: (book: BookType | null) => void
 logged_in: boolean
 email: string | null
 update_annotations:  (x: Annotation[]) => void
 user_id: string | null
  w: number
  h: number
  query_cfi: string | string[] | undefined
  logged_in: boolean
  annotations: Annotation_Item[] | []
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
export type TextSizeState = {
  value: string
  label: string
}

export type SidebarState = null | 'toc' | 'settings' | 'annotations' | 'new_annotation' | 'mobile_search' | 'menu' | 'search'

export type ResultsState = [] | ResultsData[]


export type ResultsData = {
  label: string
  s: TextSearchResultsData[] | []
  sd: string
  x: SectionType
}


export type TextSearchResultsData = {
  cfi: string;
  excerpt: string;
}

export type TextSearchResults = {
  s: TextSearchResultsData[] | []
  x: SectionType
}




export type NavItem = {
  id: string,
  href: string,
  label: string,
  subitems?: Array<NavItem>,
  parent?: string
}


export type EditDraftCfiType = (string | AnnotationInner)[]
//export type DraftCfiType = null | string | EditDraftCfiType
export type DraftCfiType = null | string | Annotation_Item
export type CurrentLocType = {
  start: {
    index: number
    href: string
    cfi: string
    displayed: {
      page: number
      total: number
    },
    location: number
    percentage: number
  }
  end: {
    index: number
    href: string
    cfi: string
    displayed: {
      page: number
      total: number
    },
    location: number
    percentage: number
  }
}
export type renditionMarkClickedData = {
  text: string
  data: string
  section: string
  loc: CurrentLocType
  epubcfi: string
}

export type HighlightObj = {
  cfi: string
  excerpt: string
}


export type SpineLoaded = {
  baseUrl: string
  epubcfi: any
  hooks: any
  items: [any]
  length: number
  loaded: boolean
  manifest: any
  spineByHref: any
  spineById: any
  spineItems: SectionType[]
  spineNodeIndex: number
}

export type RS_Option = {
  label: string
  value: string

}