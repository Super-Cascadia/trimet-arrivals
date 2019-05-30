import { isEmpty } from "lodash";
import React, { Component } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
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
        <Form className="add-bookmark-input-form">
          <div className="add-bookmark-name-input-flex-container">
            <InputGroup className="mb-3">
              <Form.Control
                type="text"
                className="add-bookmark-name-input"
                aria-label="Bookmark Section Name"
                aria-describedby="basic-addon2"
                value={this.state.bookmarkSectionName}
                placeholder="Bookmark Section Name"
                onChange={this.onChange}
              />
              <Button
                id="button-addon2"
                variant="primary"
                onClick={this.onClickAddBookmark}
                disabled={noTextEntered}
              >
                Create
              </Button>
            </InputGroup>
          </div>
        </Form>
      </div>
    );
  }
}
