import React from './lib/react'
import Reactdom from './lib/react-dom'


//简单jsx
// let div = (<h1 className='hello' id='h1' onClick={  () => console.log('clickme') }  style={ {color:'red'} }>
// <span>hello</span>
// </h1>)
// Reactdom.render(div, document.body)


// class Title组件
// class Title extends React.Component{
//   render(){
//     return (
//       <div>class： { this.props.title }</div>
//     )
//   }
// }

// 函数组件
function Title(props){
  return <h2>title： { props.title }</h2>
}

// class App组件
class App extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      title: 'its me '
    }
  } 

  bundleClick(){
    this.setState({
      title: `i'm zhizhi777`
    })
  }

  render(){
    return (<div id='app'>
              <Title title = {this.state.title}></Title> 
              <p>{ this.state.title }</p>
              <button onClick={this.bundleClick.bind(this)}>click me!</button>
            </div>)
  }
}


let div =  (<div><App/><p>Hello React!</p></div>)

// console.log(div)

Reactdom.render(div, document.body)