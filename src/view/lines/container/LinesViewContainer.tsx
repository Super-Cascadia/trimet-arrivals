import { connect } from "react-redux";
import LinesViewComponent from "../component/LinesViewComponent";

const mapStateToProps = () => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {};
};

const LinesViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(LinesViewComponent);

export default LinesViewContainer;
