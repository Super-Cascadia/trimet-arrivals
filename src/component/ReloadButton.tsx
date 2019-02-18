import cx from "classnames";
import React from "react";
import FontAwesome from "react-fontawesome";

interface Props {
  onClick: (e) => void;
  disabled: boolean;
  className?: string;
  children?: any;
}

export default class ReloadButton extends React.PureComponent<Props> {
  private onClick: (e) => void;

  constructor(props) {
    super(props);

    this.onClick = e => props.onClick(e);
  }
  public render() {
    const { disabled, className, children } = this.props;
    const classes = cx("reload-button", className);

    return (
      <button
        disabled={disabled}
        title="Reload arrivals for stop"
        className={classes}
        onClick={this.onClick}
      >
        {disabled && <FontAwesome name="refresh" spin={true} size="2x" />}
        {!disabled && <FontAwesome name="refresh" size="2x" />}
        {children}
      </button>
    );
  }
}
