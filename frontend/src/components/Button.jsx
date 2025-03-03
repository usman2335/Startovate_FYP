import React from 'react'
import "../CSS/Button.css"

const Button = ({label,onClick, padding, color, fontSize, width, marginTop}) => {

  return (
    <button className='button' onClick = {onClick } style = {{padding: padding, color: color, fontSize: fontSize, width: width, marginTop: marginTop}}><span>{label}</span></button>
  )
}

export default Button