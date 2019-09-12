import React, { Component } from 'react'
import { Icon } from 'antd'

const hourRotation = [0, -30, -60, -90, 240, -150, 180, 150, 120, 90, 60, 30]

export default class Hour extends Component {

  constructor(props) {
    super(props)

    this.state = {hovered: false}

    this._onAdd = this.onAdd.bind(this)
  }

  onAdd() {
    this.props.onAdd()
  }

  renderColor(signups) {
    switch(signups) {
      case 0:
      return '#CFD8DC'
      case 1:
        return '#e53935'
      case 2:f
        return '#FB8C00'
      case 3:
        return '#FDD835'
      case 4:
        return '#43A047'
      default:
        return '#00BCD4'
    }
  }

  render() {
    const { index, signups } = this.props
    const color = this.renderColor(signups)

    const tick = Object.assign({}, styles.tick, {
      transform: `rotate(${index * 30}deg) translate(120px)`,
      background: color,
      border: color,
      opacity: this.state.hovered? 1: 0.9
    })

    const hour = `${7 + index}:00`

    const icon = Object.assign({}, styles.hour, {
      transform: `rotate(${hourRotation[index] + 90}deg)`
    })

    const add = <div style={styles.add} onClick={this._onAdd}>+</div>

    const hourDetails = <div>
      {hour}
      <div style={styles.line} />
      <div>{signups} <Icon type="user" theme="twoTone"/></div>
    </div>

    return <div
      style={tick}
      onMouseEnter={() => this.setState({hovered: true})}
      onMouseLeave={() => this.setState({hovered: false})}
    >
      <div style={icon}>
        {this.state.hovered? add: hourDetails}
      </div>
    </div>;
  }

}


const styles = {
  hour: {
    color: '#37474F',
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    alignSelf: 'center',
    cursor: 'pointer',
    fontSize: 12
  },
  tick: {
    width: '50px',
    display: 'flex',
    height: '50px',
    userSelect: 'none',
    position: 'absolute',
    borderRadius: '50%',
    left: '40%',
    top: '40%',
    marginLeft: '-5px',
    marginTop: '-5px'
  },
  line: {
    border: '1px solid white',
    margin: '1px 0',
    width: '100%'
  },
  add: {
    fontSize: 24,
    color: 'white'
  }
}