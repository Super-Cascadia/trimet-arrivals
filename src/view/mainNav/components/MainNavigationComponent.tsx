import React from "react";
import MainNavigationMenu from "./MainNavigationMenu";

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
      <MainNavigationMenu
        numberOfBookmarks={numberOfBookmarks}
        timeOfLastLoad={timeOfLastLoad}
      />
    );
  }
}
