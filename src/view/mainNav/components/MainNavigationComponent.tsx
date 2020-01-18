import React from "react";
import MainNavigationRoute from "./MainNavigationRoute";

interface Props {
  numberOfBookmarks: number;
  timeOfLastLoad: string;
  onInitialLoad: () => void;
}

export default class MainNavigationComponent extends React.Component<Props> {
  public componentDidMount(): void {
    this.props.onInitialLoad();
  }

  public render() {
    const { numberOfBookmarks, timeOfLastLoad } = this.props;

    return (
      <div>
        <MainNavigationRoute
          numberOfBookmarks={numberOfBookmarks}
          timeOfLastLoad={timeOfLastLoad}
        />
      </div>
    );
  }
}
