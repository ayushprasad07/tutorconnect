import React from 'react'

function Alert(props) {
  const capitalize = (word)=>{
    if(word==="danger"){
      word = "error";
    }
    const lower = word.toLowerCase();
    return lower.charAt(0).toUpperCase() +lower.slice(1);
  }
  return (
      <div style={{height:"50px",marginTop:"70px" }}>
        {props.alert && <div className={`alert alert-${props.alert.type} alert-dismissible fade show`} role="alert" style={{height:"50px"}}>
        <strong>{capitalize(props.alert.type)}</strong> | {props.alert.msg}
      </div>}
      </div>
  )
}

export default Alert