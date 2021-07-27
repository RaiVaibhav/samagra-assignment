
export const FetchButton = (props) => {
  return (
    <button onClick={props.onClick} style={props.style}>{props.name} </button>
  )
}