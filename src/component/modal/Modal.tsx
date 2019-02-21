import React from "react";
import ReactDOM from "react-dom";
import "./Modal.css";

export default class Modal extends React.Component {
  private modalRoot: HTMLElement;
  private el: HTMLDivElement;

  constructor(props) {
    super(props);
    this.el = document.createElement("div");
  }

  public componentDidMount() {
    this.modalRoot = document.getElementById("modal-root");
    this.modalRoot.appendChild(this.el);
  }

  public componentWillUnmount() {
    this.modalRoot.removeChild(this.el);
  }

  public render() {
    return ReactDOM.createPortal(this.props.children, this.el);
  }
}
