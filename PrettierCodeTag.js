import React from 'react'
import { render } from 'react-dom'
import SyntaxHighlighter from 'react-syntax-highlighter'
import ReactResizeDetector from 'react-resize-detector'
import prettier from 'prettier'

export default class PrettierCodeTag extends React.Component {
  constructor() {
    super()
    this.me = null
    this.state = {
      charWidth: 8,
      charHeight: 16,
      textWidth: 30
    }
  }
  updateSize(width, height) {
    this.setState({ textWidth: width })
  }
  updateFontSize(width, height) {
    if (!this.cw) {
      return setTimeout(this.updateFontSize.bind(this), 100)
    } else {
      width = this.cw
        .querySelector('.single-character-measurement code')
        .getBoundingClientRect().width
      height = this.cw
        .querySelector('.single-character-measurement code')
        .getBoundingClientRect().height
    }
    this.setState({ charWidth: width, charHeight: height })
  }
  render() {
    // This kinda takes into account the 0.5em margin on both sides
    let columns = Math.floor(this.state.textWidth / this.state.charWidth) - 2
    let prettierOptions = Object.assign({}, this.props.options, {
      printWidth: columns
    })
    // prettier-ignore
    let debug = `${this.state.textWidth} / ${this.state.charWidth} = ${columns} chars\n${'-'.repeat(Math.max(1, columns - 1))}*`
    let code = prettier.format(this.props.code, prettierOptions)
    return (
      <div
        style={{
          width: '100%'
        }}
        ref={el => (this.el = el)}
      >
        <ReactResizeDetector
          handleWidth
          onResize={this.updateSize.bind(this)}
        />
        <div
          className="single-character-measurement"
          style={{
            visibility: 'hidden',
            position: 'absolute',
            top: 0,
            left: 0
          }}
          ref={el => (this.cw = el)}
        >
          <ReactResizeDetector
            handleWidth
            onResize={this.updateFontSize.bind(this)}
          />
          <SyntaxHighlighter language="javascript">M</SyntaxHighlighter>
        </div>
        <div className="responsive-prettier-code-box">
          <SyntaxHighlighter
            language="javascript"
            customStyle={{ background: undefined }}
          >
            {`${this.props.debug ? debug : code}`}
          </SyntaxHighlighter>
        </div>
      </div>
    )
  }
}
