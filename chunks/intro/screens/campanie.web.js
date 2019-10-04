import React from 'react'
import { Screen } from 'react-dom-chunky'
import moment from 'moment'
import { Modal, Input, InputNumber, Typography, Checkbox } from 'antd';
import { Hour } from '../components'

const { Title } = Typography;


export default class MainScreen extends Screen {
  constructor (props) {
    super(props)
    this.state = { ...this.state, showModal: false, days: {} }

    this._getId = this.getId.bind(this)
    this._handleCancel = this.handleCancel.bind(this)
    this._handleOk = this.handleOk.bind(this)
  }

  componentDidMount () {
    super.componentDidMount()

    // this.getLocations() 
  }

  getLocations() {
    // const options = {
    //   hostname: 'sheetsu.com',
    //   port: 443,
    //   path: `${dbURL}/search?city=cluj&day=1'`,
    //   method: 'GET'
    // }

    // const req = https.request(options, res => {
    //   // console.log(`statusCode: ${res.statusCode}`)

    //   res.on('data', d => {
    //     const data = JSON.parse(d.toString())
    //     this.processData(data)
    //   })
    // })

    // req.on('error', error => {
    //   console.error(error)
    // })

    // req.end()

  }

  processData(data) {
    // const hours = new Array(12).fill(0)
    const days = new Array(40).fill([])

      data.forEach(entry => {

        days[entry.day].push(entry)
      })

    this.setState({dbDays: days})
  }

  getDBHours(day) {
    const hours = []
    for (let i = 0; i <= 11; i++) {
      hours[i] = 0
    }
    const { data = [] } = this.state
    data.forEach(entry => {
      if(entry.day == day) {
         ++ hours[entry.hour]
      }
    })

    return hours
  }

  onSignup(label, event) {
    // add a debounce here
    let value

    if( label == 'signups' || label == 'hours' ) {
      value = event
    } else {
      value = event.target.value
    }

    this.setState({ [`draft${label}`]: value })
  }

  onAgree() {

  }

  handleOk() {
    const { days } = this.state

    const { draftDay, draftHour, draftname, draftphone, drafthours = 1, draftsignups = 1 } = this.state

    const stateDay = days[draftDay] || []
    const stateHour = stateDay[draftHour] || 0

    let updatedDay = stateDay
    for( let i = draftHour; i < (draftHour + drafthours); i++ ) {
      let eachHour = stateDay[i] || 0
      updatedDay[i] = eachHour + draftsignups
    }

    const updatedDays = Object.assign({}, days, {
      [draftDay]: Object.assign({}, stateDay, updatedDay)
    })

    this.setState({ showModal: false, hourIndex: null, days: updatedDays, draftsignups: 1, drafthours: 1, draftHour: null, draftDay: null  })
  }


  onAdd(hourIndex, dayIndex) {
    this.setState({ showModal: true, draftDay: dayIndex, draftHour: hourIndex })
  }

  handleCancel() {
    this.setState({ showModal: false, hourIndex: null })
  }

  getId () {
    return this.props.location && this.props.location.pathname && this.props.location.pathname.split('/')[1]
  }
  
  renderModal() {
    return <Modal
    title={`Înscrie-te la veghe de la ora ${this.state.draftHour + 7}:00`}
    visible={this.state.showModal}
    onOk={this._handleOk}
    closable={false}
    destroyOnClose={true}
    onCancel={this._handleCancel}
    cancelText="Anulează"
    >
      Nume
      <Input placeholder="Nume" onChange={this.onSignup.bind(this, 'name')}/>
      <p/>
      Telefon
      <Input placeholder="Telefon" onChange={this.onSignup.bind(this, 'phone')}/>
      <p/>
      Număr de ore
      <br />
      <InputNumber min={1} max={12 - this.state.draftHour} defaultValue={1} onChange={this.onSignup.bind(this, 'hours')}/>
      <br />
      <br />
      Număr de persoane
      <br />
      <InputNumber min={1} defaultValue={1} onChange={this.onSignup.bind(this, 'signups')}/>
      <br />
      <br />
      <div style={{fontSize: 12}}>Am citit nota de informare <a href="gdpr/agree" target="_blank">(click aici)</a> și sunt de acord cu prelucrarea datelor mele cu caracter personal. Sunt de acord să împărtășesc datele mele cu caracter personal cu 40 ProViață</div>
      <Checkbox onChange={this.onAgree.bind(this)}>Sunt de acord</Checkbox>
    </Modal>
  }
  
  renderHour(hourIndex, dayIndex, hours) {

    const day = this.state.days[dayIndex] || {}
    const hourSignups = day[hourIndex] || hours[hourIndex]

    return <Hour index={hourIndex} signups={hourSignups} onAdd={this.onAdd.bind(this, hourIndex, dayIndex)} />
  }

  renderDay(dayIndex) {
    let buttons = [];
    const hours = this.getDBHours(dayIndex)
    for (let i = 0; i <= 11; i ++) {
      buttons.push(this.renderHour(i, dayIndex, hours))
    }

    let today = moment().isAfter('09.25.2019')? moment(): moment('09.25.2019');
    let lastDay = moment('11.04.2019')
    let date = moment(today, 'DD-MM').add('days', dayIndex)
    let day = date.format('DD');
    let month = date.format('MM');

    var isAfter = moment(date).isAfter(lastDay);
    if (isAfter) {
      return null
    }

    return <div key={`day-${dayIndex}`} style={styles.day}>
      <Title>{`${day}.${month}.2019`}</Title>
      <div style={styles.circle}>
        {buttons}
      </div>
    </div>
  }

  

  renderCalendar() {
    let days = [];
    for (let i = 0; i <= 39; i ++) {
      days.push(this.renderDay(i))
    }

    return <div style={{marginBottom: 20}}>
      {days}
      {this.renderModal()}
    </div>
  }

  get cover () {
    const location = this._getId()

    const nameCapitalized = location.charAt(0).toUpperCase() + location.slice(1)

    return Object.assign({}, this.props.cover, {
      image: `${location}.jpg`,
      title: `Înscrie-te la veghe în ${nameCapitalized}`
    })
  }

  components () {
    // console.log('asdsafdsfdsdfds', this.state.dbDays)
    return super.components().concat([this.renderCalendar()])
  }
}

const styles = {
  day: {
    padding: '20px 0 40px 0'
  },
  hour: {
    color: 'black',
    flex: 1,
    textAlign: 'center',
    alignSelf: 'center',
    cursor: 'pointer',
    fontSize: 12
  },
  circle: {
    marginTop: 60,
    width: '200px',
    height: '200px',
    position: 'relative',
    transform: 'rotate(-90deg)',
    borderRadius: '50%'
  },
  tick: {
    width: '50px',
    display: 'flex',
    height: '50px',
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
  verticalSpacer: {
    margin: '20px 0'
  }
}