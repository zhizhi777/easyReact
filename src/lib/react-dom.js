import React from './react'

function render(vdom, container){
  let node = createDomFromVdom(vdom)
  container.appendChild(node)
}

function createDomFromVdom(vdom){
  let node
  if(typeof vdom === 'string'){
    node = document.createTextNode(vdom)
  }else if(typeof vdom === 'object'){
    if(typeof vdom.tag === 'function'){
      // let component = new vdom.tag(vdom.attrs)
      let component = getComponent(vdom.tag, vdom.attrs)
      component.children = vdom.children
      let vnode = component.render()
      node = createDomFromVdom(vnode)
      component.$root = node
    }else{
      node = document.createElement(vdom.tag)
    }
    setAttribute(vdom.attrs, node)
    vdom.children.forEach( children => render(children, node) )
  }
  return node
}

function getComponent(tag, attrs){
  if(tag.prototype instanceof React.Component){
    return new tag(attrs)
  }else{
    let App = class extends React.Component{}
    App.prototype.render = function(){
      return tag(attrs)
    }
    return new App()
  }
}

function renderComponent(component){
  let vdom = component.render()
  let node = createDomFromVdom(vdom)
  let classname = component.props.className
  classname.split(' ').forEach(classname=>node.classList.add(classname))
  if(component.$root){
    component.$root.parentNode.replaceChild(node, component.$root)
  }
  component.$root = node 
  component.children.forEach( children => render(children, node) )
}

function setAttribute(attrs, node){
  if(!attrs) return

  for(let key in attrs){
    if(key.startsWith('on')){
      node[key.toLowerCase()] = attrs[key]
    }else if(key === 'style'){
      Object.assign(node.style, attrs[key])
    }else{
      node[key] = attrs[key]
    }
  }
}



export {
  render,
  renderComponent
}

export default {
  render,
  renderComponent
}