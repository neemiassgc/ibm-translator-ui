import React from 'react';
import { BsTranslate } from 'react-icons/bs';
import { MdSync } from 'react-icons/md';
import loader from "./ball-triangle.svg";
import * as translator from "./services/translator";

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
      languageOptions: []
    }
  }

  componentDidMount() {
    this.fetchOptions()
  }

  fetchOptions() {
    translator.fetchLanguages()
      .then(data => {
        this.setState({
          languageOptions: data.map((lang, index) => (<option code={lang.code} key={index + 1} value={lang.name}>{lang.name}</option>))
        })
      })
      .catch(console.log);
  }

  render() {
    return (
      <div className="w-full border-2 border-stone-200 rounded-md shadow-md">
       <div className="border-b-2 border-stone-100 w-full">
          <select code={this.props.args.code} value={this.props.args.option} className="bg-white text-xl text-center font-mono font-medium block my-auto p-3 w-full" onChange={this.props.onChangeLanguageOption}>
            {this.state.languageOptions}
          </select>
       </div>
        <div className="p-2">
          <textarea disabled={this.props.args.disabled} className="w-full h-32 bg-white outline-none" style={{"resize": "none"}}></textarea>
        </div>
        <div className="p-1 text-right mx-2">
          {this.props.args.text.length}/500
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
      <button className={classes.join(" ")} onClick={props.toggleSpinner}>
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
      leftField: {
        option: "English",
        text: "",
        code: "en",
        disabled: false
      },
      rightField: {
        option: "Português",
        text: "",
        code: "pt",
        disabled: true
      },
      spinning: false
    }
  }
  
  handleLanguageOption(label, event) {
    const nextState = {
      leftField: {...this.state.leftField},
      rightField: {...this.state.rightField}
    }

    if (label === "left") {
      this.setState(prevState => {
        if (prevState.rightField.option === event.target.value) {
          [
            nextState.rightField.option,
            nextState.rightField.code,
            nextState.rightField.text
          ] = [
            prevState.leftField.option,
            prevState.leftField.code,
            prevState.leftField.text
          ]
        }

        [
          nextState.leftField.option,
          nextState.leftField.code,
          nextState.leftField.text
        ] = [
          event.target.value,
          event.target.attributes.code.value,
          ""
        ]

        return nextState;
      });

      return;
    }

    this.setState(prevState => {
      if (prevState.leftField.option === event.target.value) {
        [
          nextState.leftField.option,
          nextState.leftField.code,
          nextState.leftField.text
        ] = [
          prevState.rightField.option,
          prevState.rightField.code,
          prevState.rightField.text
        ]
      }

      [
        nextState.rightField.option,
        nextState.rightField.code,
        nextState.rightField.text
      ] = [
        event.target.value,
        event.target.attributes.code.value,
        ""
      ]

      return nextState;
    });
  }

  rotateOption() {
    const nextState = {
      leftField: {...this.state.leftField},
      rightField: {...this.state.rightField}
    }

    this.setState(prevState => {
      [
        nextState.leftField.option,
        nextState.leftField.code,
        nextState.leftField.text,
        nextState.rightField.option,
        nextState.rightField.code,
        nextState.rightField.text
      ] = [
        prevState.rightField.option,
        prevState.rightField.code,
        prevState.rightField.text,
        prevState.leftField.option,
        prevState.leftField.code,
        prevState.leftField.text
      ]

      return nextState
    });
  }

  toggleSpinner() {
    this.setState( prevState => {
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
            <Field args={this.state.leftField} onChangeLanguageOption={this.handleLanguageOption.bind(this, "left")}> </Field>
          </div>

          <div className="flex justify-center md:items-center">
            <button className="font-bold p-3 rounded-full ring-2 ring-indigo-600 bg-white active:bg-indigo-600 text-indigo-500 active:text-white hover:bg-indigo-200 h-14 w-14" onClick={this.rotateOption.bind(this)}>
              <MdSync size="lg"/>
            </button>
          </div>

          <div className="p-10 flex-grow">
            <Field args={this.state.rightField} onChangeLanguageOption={this.handleLanguageOption.bind(this, "right")}> </Field>
          </div>
        </div>

        <MainButton spinning={this.state.spinning} toggleSpinner={this.toggleSpinner.bind(this)} />

        <Footer />
      </div>
    );
  }
}

export default App;