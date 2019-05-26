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
        <form className="add-bookmark-input-form">
          <div className="add-bookmark-name-input-flex-container">
            <input
              type="text"
              className="add-bookmark-name-input"
              value={this.state.bookmarkSectionName}
              placeholder="Bookmark Section Name"
              onChange={this.onChange}
            />
          </div>
          <div className="add-bookmark-button-flex-container">
            <button
              onClick={this.onClickAddBookmark}
              disabled={noTextEntered}
              className="add-bookmark-button"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    );
  }
}
