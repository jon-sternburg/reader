
import React, { Component } from 'react'
import styles from '../homepage_styles.module.css'
import Sidebar from './Sidebar'
import Top_Bar_Homepage from './Top_Bar_Homepage'
import Top_Bar_Homepage_mobile from './Top_Bar_Homepage_mobile'
import Grid from './Grid'
import Book_Box from './Book_Box'



export default class Homepage extends Component {
constructor(props) {
  super(props);
  this.state = { 
  	selected_book: null,
  	book: null,
  	rendition: null,
    width: 0,
    height: 0
  };


}
componentDidMount() {

   window.addEventListener('resize', this.updateDimensions);
   this.updateDimensions()
}

 updateDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  };

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

select_book = (book) => this.setState({selected_book: book})


componentDidUpdate(prevProps, prevState) {
if (this.state.width !== prevState.width) {
}

}

  render() {
    return <main id = 'main'>
    <div className = {styles.homepage_frame} style = {{backgroundColor: this.state.selected_book == null ? 'whitesmoke' : '#FFF'}}>
{this.state.width >= 1000 && this.state.selected_book == null  && ( 
<Top_Bar_Homepage
rendition = {this.state.rendition}
book = {this.state.book} 
select_book = {this.select_book} 
selected_book = {this.state.selected_book}
toc = {this.state.toc} 
w={this.state.width}
h={this.state.height}
/>
)}


{this.state.width < 1000 && this.state.selected_book == null  && ( 
<Top_Bar_Homepage_mobile
rendition = {this.state.rendition}
book = {this.state.book} 
select_book = {this.select_book} 
selected_book = {this.state.selected_book}
toc = {this.state.toc} 
w={this.state.width}
h={this.state.height}
/>
)}






{this.state.selected_book == null ? 
<Grid 
select_book = {this.select_book} 
w={this.state.width}
h={this.state.height}
 />
:
<Book_Box 
selected_book = {this.state.selected_book}
select_book = {this.select_book}
w={this.state.width}
h={this.state.height}
/>
}

    </div>
    </main>
  }
}