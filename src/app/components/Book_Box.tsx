'use client'
import React, { Fragment, useState, useEffect, useRef, MouseEvent, SyntheticEvent, KeyboardEvent } from 'react'
import styles from '../css/book_box_styles.module.css'
import ePub from 'epubjs'
import { IoIosArrowBack } from "react-icons/io"
import { IoIosArrowForward } from "react-icons/io"
import { IoIosCreate } from "react-icons/io"
import { FaHighlighter } from "react-icons/fa"
import Sidebar from './Sidebar'
import Loading_Circle from './Loading_Circle'
import Top_Bar_Book from './Top_Bar_Book'
import Mobile_Search from './Mobile_Search'
import { motion, AnimatePresence } from "framer-motion"
import { AiFillHome } from "react-icons/ai"
import { FaEllipsisV } from "react-icons/fa"
import apply_ref_styles from '../util/apply_ref_styles'
import getTimeStamp from '../util/getTimeStamp'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  AnnotationData, AnnotationInner, BB_Props,
  TextSizeState, SidebarState, ResultsState,
  TextSearchResultsData, NavItem, EditDraftCfiType, DraftCfiType,
  CurrentLocType, renditionMarkClickedData, HighlightObj, TextSearchResults,
  SpineLoaded, RS_Option
} from '../types/book_box_types'
import Spine from '../../../node_modules/epubjs/types/spine'
import RenditionType from '../../../node_modules/epubjs/types/rendition'
import BookEpubType from '../../../node_modules/epubjs/types/book'
import ContentsType from '../../../node_modules/epubjs/types/contents'
//import { useSession } from 'next-auth/react';




export default function Book_Box(props: BB_Props) {
  const router = useRouter()
  const [spread, set_spread] = useState<'auto' | 'none'>('auto')
  const [text_size, set_text_size] = useState<TextSizeState>({ value: 'medium', label: 'Medium' })
  const [flow, set_flow] = useState<'paginated' | 'scrolled'>('paginated')
  const [keyvalue, set_keyvalue] = useState<string>('')
  const [results, set_results] = useState<ResultsState>([])
  const [si, set_si] = useState<number | null>(null)
  const [sidebar, set_sidebar] = useState<SidebarState>(null)
  const [empty_results, set_empty_results] = useState<boolean>(false)
  const [loading, set_loading] = useState<boolean>(true)
  const searchParams = useSearchParams()
  //const { data: session } = useSession()
  const toc = useRef<Array<NavItem> | []>([]);
  const editing = useRef<boolean>(false);
  const draft_cfi = useRef<DraftCfiType>(null);
  const book = useRef<BookEpubType>(ePub(props.selected_book.path));
  const rendition = useRef<RenditionType>(book.current.renderTo("area", {
    width: "100%",
    height: "100%",
    flow: 'paginated',
    manager: 'default',
    spread: 'auto'
  }));
  const prev_flow = useRef<'paginated' | 'scrolled'>('paginated');
  const search_highlights = useRef<Array<HighlightObj> | []>([]);
  const prev_spread = useRef<'auto' | 'none'>('auto');
  const first_loc = useRef<string | null>(null);
  const textarea_ref = useRef<HTMLTextAreaElement | null>(null);
  const input_ref = useRef<HTMLInputElement | null>(null);
  const annotation_ref = useRef<HTMLButtonElement | null>(null);
  const highlight_ref = useRef<HTMLButtonElement | null>(null);
  const popup_ref = useRef<HTMLDivElement | null>(null);
  const isAnnotationInner = (content: string | AnnotationInner): content is AnnotationInner => typeof content !== 'string'
  const isDraftCfiObj = (content: null | string | EditDraftCfiType): content is EditDraftCfiType => Array.isArray(content)
  const isAnnotationDataInner = (content: string | AnnotationInner): content is AnnotationInner => typeof content == 'object'
  const isSpine = (content: Spine | SpineLoaded): content is SpineLoaded => 'spineItems' in content
  const flag = empty_results && results.length == 0


/*
  useEffect(() => {
  async function get_book_data() {
    return await fetch(`/api/book?book_id=${props.selected_book.id}&user_id=${session?.user._id}`, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((data) => {
        let a = data[0] ? data[0].annotations : []
        if (a && a !== null && a.length > 0) {
          console.log('adding from db... ', a)
          a.map((x_: AnnotationInner) => {
            if (x_ !== null) {
              rendition.current.annotations.add('highlight', x_.cfiRange, { text: x_.data.text, data: x_.data.data, section: x_.data.section, time: x_.data.time, title: x_.data.title }, () => { })
            }
          })
      
        }
      })
      .catch(err => {
        console.log(err)
        return null
      })

  }
    if (props.logged_in) {
     get_book_data()
  

    }

  }, [props.logged_in]);
*/

  // handles back/forward button navigation for cfi pages
  useEffect(() => {
    document.title = props.selected_book.title
    function handle_pop_state(e: PopStateEvent) {
      let target = e?.target as Window
      let dest_url = target.location.href
      let current = `${process.env.NEXT_PUBLIC_CB_URL}/book/${props.selected_book.id}?cfi=${searchParams.get('cfi')}`
      if (current !== dest_url && dest_url.includes('cfi=') && rendition.current !== null) {
        let cfi_ = dest_url.slice(dest_url.indexOf('cfi=') + 4)
        rendition.current.display(cfi_)
      }
    }
    window.addEventListener('popstate', handle_pop_state);
    return () => {
      window.removeEventListener("popstate", handle_pop_state);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  function handle_mouse_down(e: Event) {
    const target = e.target as HTMLElement
    if ((target.id == '' || target.id == undefined) && popup_ref.current !== null && popup_ref.current !== undefined) {
      popup_ref.current.style.visibility = 'hidden'
    }
  }

  function keyListener(e: KeyboardEvent | Event) {
    let e_ = e as KeyboardEvent
    if (e_.key == 'ArrowRight') { next_page(e_) }
    if (e_.key == 'ArrowLeft') { previous_page(e_) }
  }


  //set book data in db (if user logged in)
  async function set_book_data() {
    let annotations_ = rendition.current.annotations.each()
    return await fetch("/api/book", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: props.selected_book.id, name: props.selected_book.title, annotations: annotations_, user_id: props.user_id, edit: false })
    })
      .then((res) => res.json())
      .then((data) => data)
      .catch(err => {
        console.log(err)
        return null
      })

  }

  //fetch book data from db (if user logged in)
  async function get_book_data() {
    return await fetch(`/api/book?book_id=${props.selected_book.id}&user_id=${props.user_id}`, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((data) => {
        let res = data[0] ? data[0].annotations : []
        return res
      })
      .catch(err => {
        console.log(err)
        return null
      })

  }




  // removes LS data after user logs in - replaces with db data
  useEffect(() => {
    async function get_book_data() {
      return await fetch(`/api/book?book_id=${props.selected_book.id}&user_id=${props.user_id}`, {
        method: 'GET',
      })
        .then((res) => res.json())
        .then((data) => {
          let a = data[0] ? data[0].annotations : []
          console.log('adding from db... ', a)
          if (a && a !== null && a.length > 0) {
         return   a.map((x_: AnnotationInner) => {
              if (x_ !== null) {
                rendition.current.annotations.add('highlight', x_.cfiRange, { text: x_.data.text, data: x_.data.data, section: x_.data.section, time: x_.data.time, title: x_.data.title }, () => { })
              }
            })
          }
        }).then(() => {
//trigger re-render of sidebar to display new annotation data
         if (si == null) {set_si(0)}  else {  set_si(null) }
        })
        .catch(err => {
          console.log(err)
          return null
        })
    }
 if (props.logged_in) {
let old_annotations = rendition.current.annotations.each()  
if (old_annotations && old_annotations.length > 0) {
old_annotations.map((x: any, i: number) => {
let x_ = isAnnotationDataInner(x[1]) ? x[1] : null
if (x_ !== null) {  rendition.current.annotations.remove(x_.cfiRange, 'highlight')}

}) 
      }
       get_book_data()
    }
  },[props.logged_in, props.selected_book.id, props.user_id])


  // builds book, adds annotations (from local storage or db), adds annotation event listeners, applies styles for annotation box, and performs cleanup
  useEffect(() => {
    book.current.ready.then(async function () {

      function get_ls_data() {
        let ls_data = localStorage.getItem(props.selected_book.id + '-annotations')
        let a = ls_data !== undefined && ls_data !== 'undefined' ? JSON.parse(ls_data || '{}') : []
        return a
      }

      console.log('logged in? ', props.logged_in)
      // check if user logged in - get annotations from local storage or db
      if (props.logged_in) {
        let a = await get_book_data()
        console.log('adding from db... ', a)
        if (a && a !== null && a.length > 0) {
          a.map((x_: AnnotationInner) => {
            if (x_ !== null) {
              rendition.current.annotations.add('highlight', x_.cfiRange, { text: x_.data.text, data: x_.data.data, section: x_.data.section, time: x_.data.time, title: x_.data.title }, () => { })
            }
          })
        }
      } else {
        let a = await get_ls_data()
        console.log('adding from ls... ', a)
        if (a && a !== null && a.length > 0) {
          a.map((x: AnnotationData) => {
            let x_ = isAnnotationInner(x[1]) ? x[1] : null
            if (x_ !== null) {
              rendition.current.annotations.add('highlight', x_.cfiRange, { text: x_.data.text, data: x_.data.data, section: x_.data.section, time: x_.data.time, title: x_.data.title }, () => { })
            }
          })
        }
      }

      // set saved location (query cfi)
      if (props.query_cfi !== null) {
        first_loc.current = props.query_cfi
        router.push(`/book/${props.selected_book.id}?cfi=${props.query_cfi}`)
      }

      book.current.loaded.navigation.then((toc) => {
        // fix for red/blue color text in some epub files
        rendition.current.themes.default({ "*:hover": { "color": `black !important` }, "*": { "color": `black !important`, "text-decoration": "none !important" } })

        // set event listeners        
        rendition.current.on("keyup", keyListener)
        document.addEventListener("keyup", keyListener, false);

        rendition.current.on("markClicked", function (cfiRange: string, data: renditionMarkClickedData) {
          annotation_clicked(cfiRange)
        })

        // detect text highlight, trigger annotation box 
        rendition.current.on("selected", function (cfiRange: string, contents: ContentsType) {
          contents.window.addEventListener('mousedown', handle_mouse_down)

          let selection = contents.window.getSelection()
          let text = selection !== null ? selection.toString() : ''

          apply_ref_styles(popup_ref, highlight_ref, annotation_ref)
          if (annotation_ref.current !== null && annotation_ref.current !== undefined &&
            highlight_ref.current !== null && highlight_ref.current !== undefined &&
            popup_ref.current !== null && popup_ref.current !== undefined) {


            let annotation_icon_ref = annotation_ref.current.children as HTMLCollectionOf<HTMLElement>
            let highlight_icon_ref = highlight_ref.current.children as HTMLCollectionOf<HTMLElement>

            highlight_icon_ref[0].setAttribute("width", '1.4em');
            highlight_icon_ref[0].setAttribute("height", '1.4em');
            highlight_icon_ref[0].style.marginRight = '10px'
            annotation_icon_ref[0].setAttribute("width", '1.6em');
            annotation_icon_ref[0].setAttribute("height", '1.6em');
            annotation_icon_ref[0].style.marginRight = '10px'

            highlight_ref.current.onclick = (e) => handle_highlight(cfiRange, text)
            annotation_ref.current.onclick = (e) => handle_annotation(cfiRange, text)
            popup_ref.current.style.visibility = 'visible'
          }
        })
        return toc
      }).then((toc_) => {
        toc.current = toc_.toc
        set_loading(false)
      }).catch(err => console.log(err))
    }).catch(err => console.log(err))

    return () => {


      document.removeEventListener("keyup", keyListener);
      document.removeEventListener("mousedown", handle_mouse_down)

      if (search_highlights.current && search_highlights.current.length > 0) { clear_input() }

      //    let annotations = rendition.current.annotations.each()
      //    localStorage.setItem(props.selected_book.id + '-annotations', JSON.stringify(annotations));
      localStorage.setItem(props.selected_book.id + '-locations', JSON.stringify(rendition.current.location));

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // set book location after loading 
  useEffect(() => {
    if (rendition.current && !loading) {
      if (first_loc.current !== null) { rendition.current.display(first_loc.current) } else { rendition.current.display() }
    }
  }, [loading])

  // resize for spread setting change
  useEffect(() => {
    if (rendition.current && spread !== prev_spread.current) {
      rendition.current.spread(spread)
      let el = document.getElementById('area')
      if (el !== null) {
        let el_dim = el.getBoundingClientRect()
        rendition.current.resize(el_dim.width, el_dim.height)
      }
    }
  }, [spread])

  // resize for flow setting change
  useEffect(() => {
    if (rendition.current && flow !== prev_flow.current) {
      rendition.current.flow(flow)
      let el = document.getElementById('area')
      if (el !== null) {
        let el_dim = el.getBoundingClientRect()
        rendition.current.resize(el_dim.width, el_dim.height)
      }
      rendition.current.themes.default({ "*:hover": { "color": `black !important` }, "*": { "color": `black !important`, "text-decoration": "none !important" } })

    }
  }, [flow])

  useEffect(() => {
    if (empty_results) {
      setTimeout(() => {
        set_empty_results(false);
      }, 2000);
    }
  }, [empty_results])


  // scroll to effect after annotation save
  useEffect(() => {
    if (sidebar == 'annotations' && si !== null) {
      let el = document.getElementsByClassName("sidebar_styles_selected_title__OLqfZ")[0] as HTMLElement
      if (el !== null && el !== undefined) { el.scrollIntoView({ behavior: "instant", block: "start" }); }

    } else if (sidebar == 'new_annotation' && draft_cfi.current !== null && editing.current) {
      update_text()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sidebar])



  function toggle_flow() {
    prev_flow.current = flow
    set_flow(flow == 'paginated' ? 'scrolled' : 'paginated')

  }

  function toggle_spread() {
    prev_spread.current = spread
    set_spread(spread == 'auto' ? 'none' : 'auto')

  }

  function set_location(x: string) {
    rendition.current.display(x)
    set_url_loc()
    set_sidebar(null)
  }

  function handle_set_text_size(x: RS_Option | null) {
    if (x !== null) {
      set_text_size(x)
      rendition.current.themes.default({ "p": { "font-size": `${x.label} !important` } })
      let el = document.getElementById('area')
      if (el !== null) {
        let el_dim = el.getBoundingClientRect()
        rendition.current.resize(el_dim.width, el_dim.height)
      }

    }
  }

  // jumps to highlight location
  function get_annotation(x: string, i: number) {
    rendition.current.display(x)
    set_url_loc()
    set_si(i)
    set_sidebar(null)
  }

  // sets stage for user to add text/title to their annotation
  function annotation_cb(cfi: string) {
    draft_cfi.current = cfi
    editing.current = false
    set_sidebar('new_annotation')
  }



  function handle_highlight(cfiRange: string, text: string) {
    if (popup_ref.current !== null && popup_ref.current !== undefined) {
      popup_ref.current.style.visibility = 'hidden'
      rendition.current.annotations.add('highlight', cfiRange, { text: text, data: 'notes go here', title: 'highlight' }, () => { })
    }
  }

  // adds marks for search highlights - these will be removed by clear input function when user cancels their text search
  function handle_search_highlight(e: Event | null, cfiRange: string, text: string, x: HighlightObj) {
    rendition.current.annotations.add('highlight', cfiRange, { text: text, data: `search for ${keyvalue}` }, () => { })
    handle_set_search_highlights(x)
  }


  function handle_set_search_highlights(x: HighlightObj) {
    search_highlights.current = [...search_highlights.current, x]
  }

  // creates highlight in text
  function handle_annotation(cfiRange: string, text: string) {
    let loc: CurrentLocType = rendition.current.currentLocation()
    let matching = toc.current.filter(y => y.href.slice(0, y.href.indexOf('#')) == loc.start.href)
    let section_ = matching && matching[0] && matching[0].label ? matching[0].label : 'No chapter available'
    rendition.current.annotations.add('highlight', cfiRange, { text: text, data: 'notes go here', section: section_, loc: loc }, () => { })
    annotation_cb(cfiRange)
    if (popup_ref.current !== null && popup_ref.current !== undefined) {
      popup_ref.current.style.visibility = 'hidden'
    }
  }

  function handle_set_sidebar(val: SidebarState) {
    if (results && results.length > 0 && props.w < 1000) { set_sidebar('search') } else { sidebar == val ? set_sidebar(null) : set_sidebar(val) }
  }

  // updates text for edit annotation
  function update_text() {
    let x = draft_cfi.current
    if (x !== null && isDraftCfiObj(x) && isAnnotationDataInner(x[1])) {
      if (input_ref.current !== null && input_ref.current !== undefined) {
        input_ref.current.value = x[1].data.title
      }
      if (textarea_ref.current !== null && textarea_ref.current !== undefined) {
        textarea_ref.current.value = x[1].data.data
      }
    }
  }


  function edit_annotation(x: AnnotationData) {
    editing.current = true
    draft_cfi.current = x
    set_sidebar('new_annotation')
  }

  async function delete_annotation(x: string, i: number) {
    return new Promise((resolve, reject) => {
      resolve(rendition.current.annotations.remove(x, 'highlight'))
    }).then(() => {
      if (props.logged_in) {
        set_book_data()
      } else {
        localStorage.setItem(props.selected_book.id + '-annotations', JSON.stringify(rendition.current.annotations.each()));
      }
      set_si(si == i ? null : i)
    }).catch(err => console.log(err))
  }

  function cancel_annotation() {
    if (!editing.current) {
      return new Promise((resolve, reject) => {
        let dc = typeof draft_cfi.current == 'string' ? draft_cfi.current : ''
        resolve(rendition.current.annotations.remove(dc, 'highlight'))
      }).then(() => {
        localStorage.setItem(props.selected_book.id + '-annotations', JSON.stringify(rendition.current.annotations.each()));
        set_sidebar(null)
      }).catch(err => console.log(err))
    } else {
      if (textarea_ref.current !== null && textarea_ref.current !== undefined) {
        textarea_ref.current.value = ''
      }
      if (input_ref.current !== null && input_ref.current !== undefined) {
        input_ref.current.value = ''
      }
      set_sidebar('annotations')
      editing.current = false
    }
  }



  function annotation_clicked(cfiRange: string) {
    let annotations = rendition.current.annotations.each()
    let fi = annotations.map(x => {
      if (Array.isArray(x)) { return x[1] }
    })
    let matching = annotations.filter(x => {
      if (Array.isArray(x)) { return x[1].cfiRange == cfiRange }
    })
    let match_ = Array.isArray(matching[0]) ? matching[0] : []
    let i = fi.indexOf(match_[1])
    set_sidebar('annotations')
    set_si(i)
  }


  async function save_annotation() {
    let time = getTimeStamp()
    let annotations = rendition.current.annotations.each()
    let dc_ = draft_cfi.current !== null && typeof draft_cfi.current == 'string' ? draft_cfi.current : draft_cfi.current !== null ? draft_cfi.current[0] : ''
    let matching = annotations.filter(x => {
      if (Array.isArray(x) && typeof dc_ == 'string') {
        return decodeURI(x[0]).replace('highlight', '') == dc_.replace('highlight', '')
      }
    })
    let text = Array.isArray(matching[0]) ? matching[0][1].data.text : ''
    let section = Array.isArray(matching[0]) ? matching[0][1].data.section : ''
    let f = Array.isArray(matching[0]) ? matching[0][1] : ''
    let index = annotations.map(x => {
      if (Array.isArray(x)) { return x[1] }
    }).indexOf(f)
    return new Promise((resolve, reject) => {
      let match_ = Array.isArray(matching[0]) ? matching[0][1] : null
      let ta_value = textarea_ref.current !== null && textarea_ref.current !== undefined ? textarea_ref.current.value : ''
      let input_value = input_ref.current !== null && input_ref.current !== undefined ? input_ref.current.value : ''

      if (match_ !== null) {
        resolve(match_.update({ text: text, data: ta_value, title: input_value, section: section, time: time }))
      }
    }).then(() => {
      if (props.logged_in) { set_book_data() } else {
        localStorage.setItem(props.selected_book.id + '-annotations', JSON.stringify(rendition.current.annotations.each()));
      }
      set_sidebar('annotations')
      set_si(index)
    }).catch(err => console.log(err))
  }

  function set_url_loc() {
    let loc_ = rendition.current.currentLocation()
    router.push(`/book/${props.selected_book.id}?cfi=${loc_.start.cfi}`)
  }

  function previous_page(e: MouseEvent | KeyboardEvent) {
    rendition.current.prev()
    set_url_loc()
  }


  function next_page(e: MouseEvent | KeyboardEvent) {
    rendition.current.next()
    set_url_loc()
  }

  function handleInputChange_text(keyvalue: string) {
    if (keyvalue.length == 0) { clear_input() } else { set_keyvalue(keyvalue) }
  }



// text search function
  function handle_text_submit(e: SyntheticEvent) {
    e.preventDefault();

    if (book.current && book.current != null && keyvalue.length > 2) {
      let results: TextSearchResults[] = []
      let spine_ = book.current.spine
      let spine_items_ = isSpine(spine_) ? spine_.spineItems : []
// builds each section for text search - results will be categorized by spine section
      Promise.all(spine_items_.map(async x => {
        return new Promise((resolve, reject) => {
          resolve(x.load(book.current.load.bind(book.current)))

        })
          .then(() => x.find(keyvalue))
          .then((s) => {
            let s_ = s as TextSearchResultsData[] | []
            let obj_ = { s: s_, x: x }
            if (s.length > 0) { results.push(obj_) }
          })
      })).catch(err => console.log(err))
        .then(() => {

          // removes duplicate excerpts
          let no_duplicates: TextSearchResults[] = results.map(x => {
            let new_s: TextSearchResultsData[] = []
            let new_s_excerpts: string[] = []
            x.s.map(y => {
              if (!new_s_excerpts.includes(y.excerpt)) {
                new_s_excerpts.push(y.excerpt)
                new_s.push(y)
              }
            })
            return { ...x, s: new_s }
          })

          let res_ = no_duplicates.map(x => {
            let matching = toc.current.filter(y => y.href.slice(0, y.href.indexOf('#')) == x.x.href)
            let label = matching && matching[0] && matching[0].label ? matching[0].label : ''
            let toc_id = matching && matching[0] && matching[0].id ? matching[0].id : ''
            return { s: x.s, x: x.x, label: label, sd: toc_id }
          })
// sorts by chapter order
          let res = res_.sort((a, b) => parseInt(a.sd.replace('np-', '')) - parseInt(b.sd.replace('np-', '')))
          set_sidebar(res && res.length > 0 ? 'search' : null)
          set_empty_results(res && res.length > 0 ? false : true)
          set_results(res)
        }).catch(err => console.log(err))
    }
  }


  function get_context(x: TextSearchResultsData, i: number, mobile: boolean) {
    set_si(i)
    rendition.current.display(x.cfi)
    set_url_loc()
    handle_search_highlight(null, x.cfi, x.excerpt, x)
    if (mobile) { set_sidebar(null) }
  }

  // removes highlights for text search results
  async function clear_input() {
    let annotations = rendition.current.annotations.each()
    return Promise.all(annotations.map((x) => {
      return new Promise((resolve, reject) => {
        let cfi_ = Array.isArray(x) ? x[1].cfiRange : ''
        let matching = search_highlights.current.filter(y => y.cfi == cfi_)
        if (matching && matching.length > 0) {
          resolve(rendition.current.annotations.remove(cfi_, 'highlight'))
        } else { resolve(null) }
      })
    })).then(() => {
      // localStorage.setItem(props.selected_book.id + '-annotations', JSON.stringify(rendition.current.annotations.each()));
      set_results([])
      set_keyvalue('')
      set_si(null)
      set_sidebar(null)
      search_highlights.current = []
    }).catch(err => console.log(err))
  }



  return (

    <Fragment>


      <Fragment>
        <div ref={popup_ref} className={styles.popup} onClick={(e) => e.preventDefault()} >
          <button type={"button"} ref={annotation_ref} >
            <IoIosCreate className={styles.annotation_icon} />
            <span>Annotation</span>
          </button>
          <button type={"button"} ref={highlight_ref} >
            <FaHighlighter className={styles.highlight_icon} />
            <span>Highlight</span>
          </button>
        </div>


        <AnimatePresence>
          {flag && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={styles.no_results}>
              No results.  Try another search!
            </motion.div>)}
        </AnimatePresence>
      </Fragment>


      {props.w > 1000 && (
        <Top_Bar_Book
          // select_book={props.select_book}
          selected_book={props.selected_book}
          clear_input={clear_input}
          results_length={results.length}
          keyvalue={keyvalue}
          handle_text_submit={handle_text_submit}
          handleInputChange_text={handleInputChange_text}
          w={props.w}
        />
      )}

      {rendition !== null && (
        <div className={styles.book_box_frame} style={{ width: props.w <= 1000 ? props.w : props.w - 80 }} >

          {sidebar !== null && props.w > 1000 && (<div className={styles.book_tint} onClick={() => handle_set_sidebar(null)} />)}

          <Sidebar
            book_title={props.selected_book.title}
            sidebar={sidebar}
            logged_in={props.logged_in}
            set_sidebar={handle_set_sidebar}
            toc={toc.current}
            email={props.email}
            w={props.w}
            mobile_search={
              <Mobile_Search
                selected_book={props.selected_book}
                clear_input={clear_input}
                results_length={results.length}
                keyvalue={keyvalue}
                handle_text_submit={handle_text_submit}
                handleInputChange_text={handleInputChange_text}
              />
            }
            textarea_ref={textarea_ref}
            input_ref={input_ref}
            rendition={rendition.current}
            get_context={get_context}
            toggle_flow={toggle_flow}
            toggle_spread={toggle_spread}
            set_text_size={handle_set_text_size}
            text_size={text_size}
            delete_annotation={delete_annotation}
            edit_annotation={edit_annotation}
            set_location={set_location}
            spread={spread}
            flow={flow}
            keyvalue={keyvalue}
            get_annotation={get_annotation}
            results={results}
            si={si}
            draft_cfi={draft_cfi.current}
            save_annotation={save_annotation}
            cancel_annotation={cancel_annotation}
            clear_input={clear_input}
          />

          {loading && (<Loading_Circle />)}

          <section id='area' className={styles.book_box_inner_wrap}>

            {props.w > 1000 && (
              <Fragment>
                {sidebar == null && (<button type={"button"} className={styles.arrow_left_arrow_wrap} onClick={(e) => previous_page(e)}><IoIosArrowBack className={styles.left_arrow_icon} /></button>)}
                <button type={"button"} className={styles.arrow_right_arrow_wrap} onClick={(e) => next_page(e)}><IoIosArrowForward className={styles.right_arrow_icon} /></button>
              </Fragment>)}
            {props.w <= 1000 && sidebar == null && (
              <Fragment>
                <footer className={styles.bottom_bar_wrap}>
                  <IoIosArrowBack className={styles.left_arrow_icon} onClick={(e) => previous_page(e)} />
                  <AiFillHome className={styles.home_mobile} onClick={() => router.push('/')} />
                  <FaEllipsisV className={styles.settings_mobile} onClick={() => handle_set_sidebar('menu')} />
                  <IoIosArrowForward className={styles.right_arrow_icon} onClick={(e) => next_page(e)} />
                </footer>
              </Fragment>
            )}
          </section>
        </div>
      )}
    </Fragment>
  )
}


