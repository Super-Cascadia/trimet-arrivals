import React from "react";

interface Props {
  loadArrivalData: (locationId: number) => void;
  locationId: number;
}

export default class StopLocationView extends React.Component<Props> {
  public componentDidMount(): void {
    this.props.loadArrivalData(this.props.locationId);
  }

  public render() {
    return <div />;
  }
}
