import React, { Component } from "react";
import { Form } from "react-bootstrap";

interface Props {
  sectionName: string;
  updateBookmarkSectionName: (bookmarkSectionName: string) => void;
}

interface State {
  sectionName: string;
}

export default class EditSectionNameInput extends Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      sectionName: props.sectionName
    };

    this.onChange = this.onChange.bind(this);
  }

  public onChange(e) {
    this.setState(
      {
        sectionName: e.target.value
      },
      () => {
        this.props.updateBookmarkSectionName(this.state.sectionName);
      }
    );
  }

  public render() {
    return (
      <Form.Control
        type="text"
        value={this.state.sectionName}
        onChange={this.onChange}
        className="mb-2 mb-md-0 edit-section-name-input"
      />
    );
  }
}
