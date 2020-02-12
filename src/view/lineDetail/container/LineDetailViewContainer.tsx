import { connect } from "react-redux";
import { RootState } from "../../../store/reducers";
import LineDetailView from "../component/LineDetailView";

const mapStateToProps = (state: RootState, props) => {
  return {
    ...props
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

const LineDetailViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(LineDetailView);

export default LineDetailViewContainer;
