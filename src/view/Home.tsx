import React, { Component, lazy, Suspense } from "react";
import ComponentLoadIndicator from "../component/loadIndicator/ComponentLoadIndicator";
import "./Home.scss";

const MainNavigation = lazy(() =>
  import(
    /* webpackChunkName: "MainNavigation" */ "../component/nav/MainNavigation"
  )
);

interface State {
  presentationShow: boolean;
}

export default class Home extends Component<{}, State> {
  constructor(props) {
    super(props);

    this.state = {
      presentationShow: false
    };

    this.showPresentation = this.showPresentation.bind(this);
  }

  public render() {
    return (
      <main>
        <MainNavigation />
        <button className="presentation-button" onClick={this.showPresentation}>
          Show Presentation
        </button>
        {this.getPresentation()}
      </main>
    );
  }

  public getPresentation() {
    if (this.state.presentationShow) {
      const CodeSplittingPresentation = lazy(() =>
        import(
          /* webpackChunkName: "CodeSplittingPresentation" */ "./CodeSplittingPresentation"
        )
      );

      return (
        <Suspense fallback={ComponentLoadIndicator()}>
          <CodeSplittingPresentation />
        </Suspense>
      );
    }

    return null;
  }

  private showPresentation() {
    this.setState({ presentationShow: !this.state.presentationShow });
  }
}
