import { RefObject} from 'react'


export default function apply_ref_styles(popup_ref: RefObject<HTMLDivElement>, highlight_ref: RefObject<HTMLButtonElement>, annotation_ref: RefObject<HTMLButtonElement>):void {

    if (popup_ref.current !== null && highlight_ref.current !== null && annotation_ref.current !== null) {
popup_ref.current.style.position = 'absolute'
popup_ref.current.style.borderRadius = '12px'
popup_ref.current.style.backgroundColor = '#b3c7f7'
popup_ref.current.style.zIndex = '999999999999999999'
popup_ref.current.style.border = '2px solid #8babf1'
popup_ref.current.style.boxShadow = '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)'
popup_ref.current.style.display = 'flex'
popup_ref.current.style.flexDirection = 'row'
popup_ref.current.style.flexWrap = 'nowrap'
popup_ref.current.style.justifyContent = 'space-around'
popup_ref.current.style.userSelect = 'none'
highlight_ref.current.style.display = 'flex'
highlight_ref.current.style.borderLeft = '.5px solid lightgrey'
highlight_ref.current.style.padding = '10px'
highlight_ref.current.style.flexWrap = 'wrap'
highlight_ref.current.style.flexDirection = 'row'
highlight_ref.current.style.justifyContent = 'center'
highlight_ref.current.style.alignItems = 'center'
highlight_ref.current.style.cursor = 'pointer'
highlight_ref.current.style.borderTopRightRadius = '12px'
highlight_ref.current.style.borderBottomRightRadius = '12px'
highlight_ref.current.style.fontFamily = `'Open Sans', sans-serif`
highlight_ref.current.style.zIndex = '999999999999999999'
highlight_ref.current.style.userSelect = 'none'
annotation_ref.current.style.display = 'flex'
annotation_ref.current.style.borderRight = '.5px solid lightgrey'
annotation_ref.current.style.padding = '10px'
annotation_ref.current.style.flexWrap = 'wrap'
annotation_ref.current.style.flexDirection = 'row'
annotation_ref.current.style.justifyContent = 'center'
annotation_ref.current.style.alignItems = 'center'
annotation_ref.current.style.cursor = 'pointer'
annotation_ref.current.style.borderTopLeftRadius = '12px'
annotation_ref.current.style.borderBottomLeftRadius = '12px'
annotation_ref.current.style.fontFamily = `'Open Sans', sans-serif`
annotation_ref.current.style.zIndex = '999999999999999999'
annotation_ref.current.style.userSelect = 'none'
}
}