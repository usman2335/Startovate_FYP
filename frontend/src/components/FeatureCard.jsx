import React, { useState } from 'react'
import "../CSS/FeatureCard.css"
import { Avatar } from 'antd'

const FeatureCard = ({img,title, description}) => {
    const [isHovered, setHovered] = useState(false);
  return (
    <div className='card'
    onMouseEnter={() => setHovered(true)}
    onMouseLeave={() => setHovered(false)}
    >
        <Avatar  className = {isHovered ? "img-hover" : "img"} size = {64} shape = "square"src={img}/>
        <h3>{title}</h3>
        <p>{description}</p>
    </div>
  )
}

export default FeatureCard