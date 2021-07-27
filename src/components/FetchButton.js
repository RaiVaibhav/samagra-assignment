import React from "react"

export const FetchButton = React.memo((props) => {
  return (
    <button onClick={props.onClick} style={props.style}>{props.name} </button>
  )
});