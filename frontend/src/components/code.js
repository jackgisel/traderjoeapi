import React from "react"

const Code = props => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        margin: 0,
        paddingRight: 10,
        paddingLeft: 10,
        paddingTop: 3,
        paddingBottom: 3,
        backgroundColor: "lightGrey",
      }}
    >
      <span
        style={{
          fontFamily: "monospace",
        }}
      >
        {props.text}
      </span>
    </div>
  )
}
export default Code
