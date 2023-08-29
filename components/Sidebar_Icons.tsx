import styles from '../css/sidebar_styles.module.css'
import { FaSearch } from "react-icons/fa"
import { FaListOl } from "react-icons/fa"
import { FaStickyNote } from "react-icons/fa"
import { AiFillSetting } from "react-icons/ai"
import { SidebarState } from '../types/sidebar_types'
type SI_Props = {
  results_length: number
  annotations_length: number
  set_sidebar: (x: SidebarState) => void
}

export default function Sidebar_Icons(props: SI_Props) {

  return (
    <div className={styles.sidebar_icons}>
      <button type={"button"} className={styles.toc_icon} onClick={() => props.set_sidebar('toc')} ><FaListOl className={styles.toc} /></button>
      <button type={"button"} className={styles.settings_icon} onClick={() => props.set_sidebar('settings')}><AiFillSetting className={styles.settings} /></button>
      <button type={"button"} className={props.annotations_length > 0 ? styles.annotations_icon : styles.annotations_icon_disabled} onClick={() => props.annotations_length > 0 ? props.set_sidebar('annotations') : {}}><FaStickyNote /></button>
      {props.results_length > 0 && (<button type={"button"} className={styles.indicator_icon} onClick={() => props.set_sidebar('search')}><FaSearch className={styles.indicator} /></button>)}
    </div>

  )
}