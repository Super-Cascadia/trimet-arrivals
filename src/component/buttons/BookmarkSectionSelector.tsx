import { map } from "lodash";
import React, { Component } from "react";
import { StopLocation } from "../../api/trimet/types";
import {
  BookmarkSectionProps,
  BookmarkSectionsProps
} from "../../store/reducers/bookmarkSectionReducer";

interface Props {
  bookmarkSections: BookmarkSectionsProps;
  stopLocation: StopLocation;
  onBookmarkSectionSelect: (
    selectedBookmarkSection: number,
    stopLocation: StopLocation
  ) => void;
}

interface State {
  selected: number;
}

export default class BookmarkSectionSelector extends Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = { selected: 0 };
    this.updateSelected = this.updateSelected.bind(this);
  }

  public getOptions(bookmarkSections: BookmarkSectionsProps) {
    return map(
      bookmarkSections,
      (bookmarkSection: BookmarkSectionProps, key: number) => {
        return (
          <option value={key} key={key} selected={key === this.state.selected}>
            {bookmarkSection.name}
          </option>
        );
      }
    );
  }

  public updateSelected(e) {
    const selected = parseInt(e.target.value, 10);
    const { stopLocation, onBookmarkSectionSelect } = this.props;

    this.setState({ selected }, () =>
      onBookmarkSectionSelect(selected, stopLocation)
    );
  }

  public render() {
    const { bookmarkSections } = this.props;

    return (
      <select onChange={this.updateSelected}>
        {this.getOptions(bookmarkSections)}
      </select>
    );
  }
}
