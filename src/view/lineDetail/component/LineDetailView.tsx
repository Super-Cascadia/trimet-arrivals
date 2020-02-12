import React from "react";

interface Props {
  id: number;
}

export default class LinesViewComponent extends React.Component<Props> {
  public render() {
    const { id } = this.props;

    return <div id="lines-detail-view">Line Detail View for {id}</div>;
  }
}
