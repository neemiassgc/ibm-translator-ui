import React from 'react';
import { BsTranslate } from 'react-icons/bs';
import { MdSync } from 'react-icons/md';
import loader from "./ball-triangle.svg";

function Header() {
  return (
    <div className="w-full p-5 shadow-md border-b-2 bg-indigo-600">
      <div className="flex justify-center">
        <BsTranslate size="2.5rem" className="text-white"/>
        <h2 className="text-white text-3xl font-bold ml-5">IBM Translator</h2>
      </div>
    </div>
  )
}

function Footer() {
  return (
    <div className="w-full p-5 bg-white static md:absolute md:bottom-0">
      <h1 className="text-indigo-600 text-center font-bold">&copy; Created by Neemias Santos - 2022</h1>
    </div>
  )
}

class Field extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentText: "",
    }
  }

  changeText(event) {
    this.setState({
      currentText: event.target.value
    })
  }

  render() {
    const options = []
    options[0] = <option key="1" value="Canada">Canada</option>
    options[1] = <option key="2" value="Japan">Japan</option>
    options[2] = <option key="3" value="Brazil">Brazil</option>
    options[3] = <option key="4" value="Italy">Italy</option>

    return (
      <div className="w-full border-2 border-stone-200 rounded-md shadow-md">
       <div className="border-b-2 border-stone-100 w-full">
          <select label={this.props.label} value={this.props.currentValue} className="bg-white text-xl text-center font-mono font-medium block my-auto p-3 w-full" onChange={this.props.changeOption}>
            {options}
          </select>
       </div>
        <div className="p-2">
          <textarea onChange={this.changeText.bind(this)} disabled={this.props.disabled} className="w-full h-32 bg-white outline-none" style={{"resize": "none"}}></textarea>
        </div>
        <div className="p-1 text-right mx-2">
          {this.state.currentText.length}/500
        </div>
      </div>
    )
  }
}

function MainButton(props) {
  let component = null

  if (props.spinning) component = (<img className="mx-auto" src={loader} alt="loader" />)
  else {
    const classes = [
      "bg-white",
      "text-indigo-600",
      "ring-2",
      "ring-indigo-600",
      "active:bg-indigo-600",
      "active:text-white",
      "hover:bg-indigo-200",
      "font-medium",
      "text-lg",
      "tracking-wide",
      "py-2",
      "px-4",
      "rounded"
    ]
    
    component =(
      <button className={classes.join(" ")} onClick={props.turnOnSpinner}>
        Translate
      </button>
    )
  }

  return (
    <div className="mt-2 w-full text-center p-3 static">
      {component}
    </div>
  )
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      leftText: "",
      leftOption: "",
      rightOption: "",
      spinning: false
    }
  }

  changeOption(event) {
    this.turnOnSpinner();

    if (event.target.attributes.label.value === "left") {
      this.setState({
        leftOption: event.target.value
      });
      return;
    }

    this.setState({
      rightOption: event.target.value
    });
  }

  rotateOption(event) {
    this.setState((prevState) => {
      const tempOption = prevState.leftOption;
      return {
        leftOption: prevState.rightOption,
        rightOption: tempOption
      }
    });
  }

  turnOnSpinner() {
    this.setState( (prevState) => {
      return {
        spinning: !prevState.spinning
      }
    });
  }

  render() {
    return (
      <div className="container min-w-full">
        <Header />
        
        <div className="flex-cols md:flex w-full mt-5">
          <div className="p-10 flex-grow">
            <Field label="left" currentValue={this.state.leftOption} changeOption={this.changeOption.bind(this)} disabled={false}> </Field>
          </div>

          <div className="flex justify-center md:items-center">
            <button className="font-bold p-3 rounded-full ring-2 ring-indigo-600 bg-white active:bg-indigo-600 text-indigo-500 active:text-white hover:bg-indigo-200 h-14 w-14" onClick={this.rotateOption.bind(this)}>
              <MdSync size="lg"/>
            </button>
          </div>

          <div className="p-10 flex-grow">
            <Field label="right" currentValue={this.state.rightOption}  changeOption={this.changeOption.bind(this)} disabled={true}> </Field>
          </div>
        </div>

        <MainButton spinning={this.state.spinning} turnOnSpinner={this.turnOnSpinner.bind(this)} />

        <Footer />
      </div>
    );
  }
}

export default App;