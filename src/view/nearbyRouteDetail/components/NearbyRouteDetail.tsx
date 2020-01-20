import React from "react";

interface Props {
  id: number;
  loadRouteData: (id: number) => {};
}

export default class NearbyRouteDetail extends React.Component<Props> {
  public componentDidMount(): void {
    this.props.loadRouteData(this.props.id);
  }

  public render() {
    const { id } = this.props;
    return <div>Nearby Route Details {id}</div>;
  }
}
