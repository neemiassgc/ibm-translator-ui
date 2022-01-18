import React from 'react';
import { BsTranslate } from 'react-icons/bs';
import { MdSync } from 'react-icons/md';
import ballTriangleLoader from "./ball-triangle.svg";
import threeDotsLoader from "./three-dots.svg";
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

function Field(props) {
  let button = null;
  if (props.status === "loading")
    button = (<img src={threeDotsLoader} className="mx-auto py-3" alt="Loading..."/>)
  else {
    button = (
      <select code={props.args.code} value={props.args.option} className="bg-white text-zinc-700 text-xl text-center font-medium block my-auto p-3 w-full" onChange={props.onChangeLanguageOption}>
        {props.languageOptions}
      </select>
    )
  }

  return (
    <div className="w-full border-2 border-stone-200 rounded-md shadow-md">
      <div className="border-b-2 border-stone-100 w-full">
        {button}
      </div>
      <div className="p-2">
      <textarea disabled={props.status === "loading" || props.status === "translating"}
        onChange={props.onChangeText}
        value={props.args.text}
        className="w-full h-44 bg-white outline-none p-4 text-zinc-700 no-underline"
        style={{"resize": "none"}}
        spellCheck={false}>
      </textarea>
      </div>
      <div className="p-1 text-right mx-2">
        {props.args.text.length}/500
      </div>
    </div>
  )
}

function SwapButton(props) {
  let button = null
  
  if (props.status === "loading") 
    button = (<img className="mx-auto" src={threeDotsLoader} alt="threeDotsLoader" />)
  else {
    button = (
      <button disabled={props.status === "translating"}
        className="font-bold p-3 rounded-full ring-2 ring-indigo-600 bg-white active:bg-indigo-600 text-indigo-500 active:text-white hover:bg-indigo-200 h-14 w-14"
        onClick={props.onClick}>
        <MdSync size="lg"/>
      </button>
    )
  }

  return button
}

function MainButton(props) {
  let button = null

  if (props.status === "translating")
    button = (<img className="mx-auto" src={ballTriangleLoader} alt="ballTriangleLoader" />)
  else if (props.status === "loading")
    button = (<img className="mx-auto" src={threeDotsLoader} alt="threeDotsLoader" />)
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
    
    button =(
      <button className={classes.join(" ")} onClick={props.onClick}>
        Translate
      </button>
    )
  }

  return (
    <div className="mt-2 w-full text-center p-3 static">
      {button}
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
      },
      rightField: {
        option: "Português",
        text: "",
        code: "pt",
      },
      status: "loading",
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
          languageOptions: data.map((lang, index) => (<option code={lang.code} key={index + 1} value={lang.name}>{lang.name}</option>)),
          status: "idle"
        })
      })
      .catch(err => this.state.setState({languageOptions: err, status: "idle"}));
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
          event.target.selectedOptions[0].attributes.code.value,
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
        event.target.selectedOptions[0].attributes.code.value,
        ""
      ]

      return nextState;
    });
  }

  handleRotateLanguageOption() {
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

  changeStatus(status) {
    this.setState({status: status})
  }
  
  handleChangeText(label, event) {
    this.setState(prevState => {
      if (label === "left")
        return {leftField: {...prevState.leftField, text: event.target.value}}

      return {rightField: {...prevState.rightField, text: event.target.value}}
    });
  }

  translate() {
    this.changeStatus("translating")

    translator.translate(this.state.leftField.code, this.state.rightField.code, this.state.leftField.text)
      .then(data => {
        this.setState(prevState => {
          return {
            rightField: {...prevState.rightField, text: data},
          }
        })
      })
      .catch(err => {
        this.setState(prevState => {
          return {
            rightField: {...prevState.rightField, text: err.message},
          }
        })
      })
      .finally(() => this.changeStatus("idle"))
  }

  render() {
    return (
      <div className="container min-w-full">
        <Header />
        
        <div className="flex-cols md:flex w-full mt-5">
          <div className="p-10 flex-grow">
            <Field args={{...this.state.leftField}} status={this.state.status} languageOptions={this.state.languageOptions}
            onChangeLanguageOption={this.handleLanguageOption.bind(this, "left")}
            onChangeText={this.handleChangeText.bind(this, "left")}> </Field>
          </div>

          <div className="flex justify-center md:items-center">
            <SwapButton status={this.state.status} onClick={this.handleRotateLanguageOption.bind(this)} />
          </div>

          <div className="p-10 flex-grow">
            <Field args={{...this.state.rightField}} status={this.state.status} languageOptions={this.state.languageOptions}
            onChangeLanguageOption={this.handleLanguageOption.bind(this, "right")}
            onChangeText={this.handleChangeText.bind(this, "right")}> </Field>
          </div>
        </div>

        <MainButton status={this.state.status} onClick={this.translate.bind(this)}/>

        <Footer />
      </div>
    );
  }
}

export default App;