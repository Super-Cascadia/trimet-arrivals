import { isEmpty } from "lodash";
import React, { Component } from "react";
import "./AddBookmarkSectionControl.css";

interface Props {
  onSectionNameUpdate: (name: string) => void;
  bookmarkSectionName: string;
  createBookmarkSection: () => void;
}

interface State {
  bookmarkSectionName: string;
}

export default class AddBookmarkSectionControl extends Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      bookmarkSectionName: props.bookmarkSectionName
    };

    this.onChange = this.onChange.bind(this);
    this.onClickAddBookmark = this.onClickAddBookmark.bind(this);
  }

  public componentWillReceiveProps(nextProps: Readonly<Props>): void {
    this.setState({
      bookmarkSectionName: nextProps.bookmarkSectionName
    });
  }

  public onChange(e) {
    const name = e.target.value;

    this.setState(
      {
        bookmarkSectionName: name
      },
      () => this.props.onSectionNameUpdate(name)
    );
  }

  public onClickAddBookmark(e) {
    e.stopPropagation();
    e.preventDefault();

    this.props.createBookmarkSection();
  }

  public render() {
    const noTextEntered = isEmpty(this.state.bookmarkSectionName);

    return (
      <div className="add-bookmark-section-control">
        <form className="add-bookmark-input">
          <input
            type="text"
            value={this.state.bookmarkSectionName}
            onChange={this.onChange}
          />
          <button onClick={this.onClickAddBookmark} disabled={noTextEntered}>
            Add Bookmark List
          </button>
        </form>
      </div>
    );
  }
}
