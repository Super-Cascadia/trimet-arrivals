import { connect } from "react-redux";
import {
  createBookmarkSectionRequest,
  sectionNameUpdateRequest
} from "../../../store/action/bookmarkSectionActions";
import { RootState } from "../../../store/reducers";
import {
  bookmarkSectionSelectors,
  sectionNameInputSelector
} from "../../../store/selectors/bookmarkSectionSelectors";
import BookmarkSectionsComponent from "../component/bookmarkSections/BookmarkSectionsComponent";

const mapStateToProps = (state: RootState) => {
  return {
    bookmarkSectionName: sectionNameInputSelector(state),
    bookmarkSections: bookmarkSectionSelectors(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onSectionNameUpdate(name: string) {
      dispatch(sectionNameUpdateRequest(name));
    },
    createBookmarkSection() {
      dispatch(createBookmarkSectionRequest());
    }
  };
};

const BookmarkSectionsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(BookmarkSectionsComponent);

export default BookmarkSectionsContainer;
