import React from 'react'
import "../CSS/Button.css"

const Button = ({label,onClick, padding, color, fontSize}) => {

  return (
    <button className='button' onClick = {onClick } style = {{padding: padding, color: color, fontSize: fontSize}}><span>{label}</span></button>
  )
}

export default Button