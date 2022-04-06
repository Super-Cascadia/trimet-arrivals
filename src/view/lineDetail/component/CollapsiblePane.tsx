import React from "react";
import { Card } from "react-bootstrap";
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
      // <article className={`${className}`}>
      <div>{children}</div>
      // </article>
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
      <Card>
        <Card.Header>{title}</Card.Header>
        <Card.Body>
          <Card.Text>
            {CollapsiblePane.getPaneContents(className, children)}
          </Card.Text>
        </Card.Body>
      </Card>
    );
  }
}
