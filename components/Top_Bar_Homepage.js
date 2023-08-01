

import React, { Component, Fragment} from 'react'
import styles from '../top_bar_styles.module.css'
import { FaBookOpen } from "react-icons/fa"
import { AiFillHome } from "react-icons/ai"
import _ from 'lodash'
import parse from 'html-react-parser';
import OutsideAlerter from '../util/OutsideAlerter'
import { useRouter } from 'next/router'
import Link from 'next/link'


let book_data = require('./update_books.json')


export default class Top_Bar_Homepage extends Component {
constructor(props) {
  super(props);
  this.state = { 
    keyvalue: '',
    results: [],
  };

this.input = React.createRef();

}


cancel_search = () => {

this.setState({results: [], keyvalue: ''})

}


handleInputChange_text = keyvalue => this.setState({keyvalue: keyvalue})



handleInputChange = (keyvalue) => {
this.setState({keyvalue: keyvalue})
this.handleSearchChange()
  };


  handleSearchChange = (e) => {
    setTimeout(() => {
      if (this.state.keyvalue.length < 1) 
        this.setState({keyvalue: '', results: []})


    const re = new RegExp(_.escapeRegExp(this.state.keyvalue), "i");
    const isMatch_title = (result) => re.test(result.title);
    const isMatch_author = (result) => re.test(result.author)

    let _source = book_data
    let results_title = _.filter(_source, isMatch_title)
    let results_author = _.filter(_source, isMatch_author)
    let results = results_title.concat(results_author)

if (this.state.keyvalue.length > 2) {

this.setState({results: results})
}}, 500);
    
}

  render() {
let title = this.props.selected_book == null ? 'Reader' : this.props.selected_book.title

    return <div className = {styles.top_bar_frame}>


<Link key = {'home'} href={`/`} className = {styles.title_wrap}>
<FaBookOpen id = {styles.book_icon} /><span id = {styles.title} onClick = {() => this.props.select_book(null)}>{title}</span>
</Link>

{this.props.selected_book !== null && (
<div id = {styles.home_button} onClick = {() => this.props.select_book(null)}> <AiFillHome id = {styles.home} /></div> )}


{this.state.results.length > 0    ?

<Fragment>
{this.props.selected_book == null ? 
<OutsideAlerter cancel_search = {this.cancel_search}>
<ul className = {styles.search_results_homepage}>
{this.state.results.map((x, i) => {
return <li key = {x + i} onClick = {() => this.props.select_book(x)}>
<p>

{x.title}, <span style = {{fontStyle: 'italic'}}> {x.author} </span>

</p>

</li>
})}
</ul>
</OutsideAlerter>
: null }
</Fragment>
:  null}


<div className = {styles.header_wrap}>

{this.props.w > 1000 && (
<div className = {styles.topbar_search_wrap}>
<form  onSubmit={(e) => e.preventDefault()}  role="search">
    <input 
    id="search_input_homepage" 
    placeholder="Search books..." 
    value={this.state.keyvalue}
    onChange={(e) => this.handleInputChange(e.target.value)}
    />
</form>
</div>

)}


  </div>

    </div>
  }
}

