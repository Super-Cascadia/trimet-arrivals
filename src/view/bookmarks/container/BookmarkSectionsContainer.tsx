import { connect } from "react-redux";
import {
  createBookmarkSectionRequest,
  sectionNameUpdateRequest
} from "../../../store/action/bookmarkActions";
import { RootState } from "../../../store/reducers";
import {
  bookmarkInputSectionnameSelector,
  bookmarkSectionSelector
} from "../../../store/selectors/bookmarkSelectors";
import BookmarkSectionsComponent from "../component/BookmarkSectionsComponent";

const mapStateToProps = (state: RootState) => {
  return {
    bookmarkSectionName: bookmarkInputSectionnameSelector(state),
    bookmarkSections: bookmarkSectionSelector(state)
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
