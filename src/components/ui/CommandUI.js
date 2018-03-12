import React, { Component } from 'react'

export default function CommandUI({input, output, onInputChange, onSubmit, error}) {
  return (
    <div className='command'>
      <div className='command__column'>
        <h2 className='command__heading'>Input</h2>
        <textarea
          id='input'
          className='command__textarea'
          rows='10'
          value={input}
          onChange={onInputChange} />
        {error ? <p className='command__error'>{error}</p> : null}
      </div>
      <button
        className='command__button'
        onClick={onSubmit}
        disabled={output}>
        <i className='fas fa-angle-right command__button--icon' />
      </button>
      <div className='command__column'>
        <h2 className='command__heading'>Output</h2>
        <textarea
          id='output'
          className='command__textarea'
          rows='10'
          value={output}
          disabled />
      </div>
    </div>
  )
}
