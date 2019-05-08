import React, { Component } from "react";

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
      <input
        type="text"
        value={this.state.sectionName}
        onChange={this.onChange}
        className="edit-section-name-input"
      />
    );
  }
}
