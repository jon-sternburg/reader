
import React, { Component, Fragment} from 'react'
import '../css/settings.css'

import Select from 'react-select';
import { CgFormatJustify } from "react-icons/cg"
import {GiMouse} from "react-icons/gi"
import {CgArrowsH} from "react-icons/cg"




const storage = global.localStorage || null;

var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

const text_size_options = [
  { value: 'x-large', label: 'X-Large' },
  { value: 'large', label: 'Large' },
  { value: 'medium', label: 'Medium' },
  { value: 'small', label: 'Small' }
]

 const customStyles = {
    control: (provided, state) => ({
      ...provided,
      background: '#fff',
      borderColor: '#9e9e9e',
      minHeight: '30px',
      height: '30px',
      color: 'black',
      boxShadow: state.isFocused ? null : null,
    }),

    valueContainer: (provided, state) => ({
      ...provided,
      height: '30px',
      padding: '0 6px'
    }),
    indicatorsContainer: (provided, state) => ({
      ...provided,
      height: '30px',
    }),
  };



export default class Settings extends Component {



  render() {


    return <div className = 'settings_wrap'>




<div className = 'settings_option first'>
<span id = 'setting_name'>Page layout</span>
<div id = 'options'>
<div className = {this.props.spread =='none' ? 'single_wrap enabled' : 'single_wrap disabled'} onClick = {() => this.props.toggle_spread()}>
<CgFormatJustify id = 'single_page' />
</div>
<div className = {this.props.spread =='auto' ? 'double_wrap enabled' : 'double_wrap disabled'} onClick = {() => this.props.toggle_spread()} >
<CgFormatJustify id = 'double_page' />
<CgFormatJustify id = 'double_page' />
</div>
</div>
</div>


<div className = 'settings_option'>
<span id = 'setting_name'>Navigation</span>
<div id = 'options'>
<div className = {this.props.flow !== 'paginated' ? 'scroll_flow enabled' : 'scroll_flow disabled'} onClick = {() => this.props.toggle_flow()}>
<GiMouse id = 'scroll_flow_icon' />
</div>
<div className = {this.props.flow == 'paginated' ? 'arrow_flow enabled' : 'arrow_flow disabled'} onClick = {() => this.props.toggle_flow()}>
<CgArrowsH id ='arrow_flow_icon' />
</div>
</div>
</div>


<div className = 'settings_option'>
<span id = 'setting_name'>Text Size</span>
<div className = 'dropdown_wrap'>
<Select
value={this.props.text_size}
onChange={this.props.set_text_size}
options={text_size_options}
placeholder = {this.props.text_size}
isSearchable = {false}
styles = {customStyles}
      />
</div>
</div>
</div>
  }
}

