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
    // Extract props
    let {
      debug,
      code,
      options,
      subtract,
      ...syntaxHighlighterProps
    } = this.props
    // The subtract prop lets us offset for line number width manually
    subtract = subtract ? parseInt(subtract) : 0
    // This kinda takes into account the 0.5em margin on both sides
    let columns =
      Math.floor(this.state.textWidth / this.state.charWidth) - 2 - subtract
    // prettier-ignore
    debug = `${this.state.textWidth} / ${this.state.charWidth} = ${columns} chars\n${'-'.repeat(Math.max(1, columns - 1))}*`
    options = Object.assign({}, options, { printWidth: columns })
    code = prettier.format(code, options)
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
          <SyntaxHighlighter
            language="javascript"
            {...syntaxHighlighterProps}
            showLineNumbers={false}
          >
            M
          </SyntaxHighlighter>
        </div>
        <div className="responsive-prettier-code-box">
          <SyntaxHighlighter language="javascript" {...syntaxHighlighterProps}>
            {`${this.props.debug ? debug : code}`}
          </SyntaxHighlighter>
        </div>
      </div>
    )
  }
}
