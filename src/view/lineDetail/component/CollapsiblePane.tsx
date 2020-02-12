import React from "react";
import "./CollapsiblePane.scss";

interface Props {
  className: string;
  title: string;
  open: boolean;
}

interface State {
  open: boolean;
}

export default class CollapsiblePane extends React.Component<Props, State> {
  private static getPaneContents(className, children) {
    return (
      <article className={`${className}`}>
        <div>{children}</div>
      </article>
    );
  }

  constructor(props) {
    super(props);

    this.state = {
      open: this.props.open || true
    };

    this.handleToggleClick = this.handleToggleClick.bind(this);
  }

  public handleToggleClick() {
    this.setState({
      open: !this.state.open
    });
  }

  public render() {
    const { title, className, children } = this.props;
    const { open } = this.state;

    return (
      <section className="collapsible-pane">
        <header>
          <h2>
            {title}{" "}
            <button onClick={this.handleToggleClick}>
              {open ? "Hide" : "Show"}
            </button>
          </h2>
        </header>
        {open && CollapsiblePane.getPaneContents(className, children)}
      </section>
    );
  }
}
