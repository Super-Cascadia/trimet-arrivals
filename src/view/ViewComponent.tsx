import React from "react";
import { NEARBY_STOPS } from "../store/reducers/viewReducer";
import StopsContainer from "./stops/containers/StopsContainer";

interface Props {
  activeView: string;
}

export default class ViewComponent extends React.Component<Props> {
  public getView() {
    switch (this.props.activeView) {
      case NEARBY_STOPS:
        return <StopsContainer />;
      default:
        return <StopsContainer />;
    }
  }

  public render() {
    return <div>{this.getView()}</div>;
  }
}
