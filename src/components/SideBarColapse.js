import React from 'react'
import { Link } from 'react-router-dom'

function SideBarColapse({title,destination}) {
    return (
        
                
                        <li>
                            <Link  to={destination}>
                                <span className="sub-item">{title}</span>
                            </Link>
                        </li>
                    
    )
}

export default SideBarColapse