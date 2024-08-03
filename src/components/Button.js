import React from 'react'

function Button({name,funct}) {

  return (
    <button className='btn btn-primary btn-border btn-round' onClick={funct}> {name}

    </button>
  )
}

export default Button;
