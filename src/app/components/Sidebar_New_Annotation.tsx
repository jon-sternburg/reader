'use client'
import { Fragment, useState, ChangeEvent, useEffect, useRef} from 'react'
import styles from '../css/sidebar_styles.module.css'
import { CirclePicker } from 'react-color';
import CreatableSelect from 'react-select/creatable';
import { Annotation_Item } from '../types/book_box_types'


type SNA_Props = {
    handle_save_annotation: (picked_category: option_uc | null, color: string, edit: Annotation_Item | null, ta_val: string, input_val: string) => void
    handle_cancel_annotation: () => void
    user_categories:default_uc
    edit: Annotation_Item | null
  }
  
  type default_uc = option_uc[]
  
  type option_uc = {
    label: string
    value: string
  }
  
  

type HSLColor = {
    a?: number | undefined;
    h: number;
    l: number;
    s: number;
  }
  
  type RGBColor = {
    a?: number | undefined;
    b: number;
    g: number;
    r: number;
  }
  
  
  type ColorResult = {
    hex: string;
    hsl: HSLColor;
    rgb: RGBColor;
  }
  



export default function Sidebar_New_Annotation(props: SNA_Props) {
    const [color_panel, set_color_panel] = useState<boolean>(false)
    const [color, set_color] = useState<string>(props.edit !== null && props.edit.data.color ?  props.edit.data.color : '#ffeb3b')
    const [picked_category, set_picked_category] = useState<option_uc | null>(props.edit !== null && props.edit.data.category ?  props.edit.data.category : null);
    const [options, set_options] = useState<default_uc>(props.user_categories);
  
    const textarea_ref = useRef<HTMLTextAreaElement | null>(null);
    const input_ref = useRef<HTMLInputElement | null>(null);
  
  
  useEffect(() => {
  
  if (props.edit !== null) { 
    if (input_ref && input_ref.current !== null && input_ref.current !== undefined) {
      input_ref.current.value = props.edit.data.title
    }
    if (textarea_ref && textarea_ref.current !== null && textarea_ref.current !== undefined) {
      textarea_ref.current.value = props.edit.data.data
    }
  
  }
  

  return () => {

    if (input_ref && input_ref.current !== null && input_ref.current !== undefined) {
      input_ref.current.value = ''
    }
    if (textarea_ref && textarea_ref.current !== null && textarea_ref.current !== undefined) {
      textarea_ref.current.value = ''
    }
  
     }



  }, [props.edit])
  
  
  
  
  
  
  
  function toggle_color_panel() {
  set_color_panel(!color_panel)
  }
  
    function handle_color_change(color_:ColorResult, event: ChangeEvent<HTMLInputElement>) {
      set_color(color_.hex)
      set_color_panel(false)
  
      }
  
      const createOption = (label: string) => ({
        label,
        value: label.toLowerCase().replace(/\W/g, ''),
      });
  
      
      function handle_create_option(label:string) {
        const new_option = createOption(label)
        set_options(prevState => [...prevState, new_option])
        set_picked_category(new_option);
      }
  



function handle_save(picked_category: option_uc | null, color: string, edit_:Annotation_Item | null) {
  
  let ta_val = textarea_ref.current !== null ? textarea_ref.current.value : ''
  let input_val = input_ref.current !== null ?  input_ref.current.value : ''

  props.handle_save_annotation(picked_category, color, props.edit, ta_val, input_val)

}

function handle_cancel() {
  props.handle_cancel_annotation()

}


  return ( 
<Fragment>
      <div className = {styles.annotation_options_wrap}>
  
  <div className = {styles.pick_color_wrap}>
    <div className = {styles.relative_wrap}>
  {color_panel && (
    <div className ={styles.circle_wrap_inner} >
  <CirclePicker onChange={handle_color_change} />
  </div>
    )}
  
  <button aria-label = {"Highlight color"} type = {'button'} className = {styles.highlight_color_button} onClick = {() => toggle_color_panel()}>
  <span>Highlight color</span>
  <div className = {styles.picked_color_sample} style = {{background: color}} />
  </button>
  </div>
  </div>
  
  
  <div className = {styles.pick_category_wrap}>
    <div className = {styles.pick_category_inner}>
      <span>Category</span>
  <CreatableSelect 
  isClearable 
  className={styles.category_select_wrap}
  options={options}
  onChange={(newValue) => set_picked_category(newValue)}
  onCreateOption={handle_create_option}
  value={picked_category}
  maxMenuHeight={200}
  placeholder={'Create...'}
  />
  </div>
  </div>
    </div>
    <div className={styles.annotation_title_wrap}>
      <input ref={input_ref} className={styles.title_input_search} placeholder="Title..." name="annotation_title_search" type="text" />
    </div>
    <div className={styles.annotation_text_wrap_inner}>
      <textarea ref={textarea_ref} className={styles.textarea_id} placeholder={'Notes...'} />
  
  
  
    
    <div className={styles.button_wrap}>
      <div className={styles.save} onClick={() => handle_save(picked_category, color, props.edit)}>Save</div>
      <div className={styles.cancel} onClick={() => handle_cancel()}>Cancel</div>
    </div>
    </div>
    
    
  
    </Fragment>
  
  
  )
  
  
  
  }