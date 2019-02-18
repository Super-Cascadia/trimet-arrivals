import cx from "classnames";
import React from "react";
import FontAwesome from "react-fontawesome";

export type Event = React.MouseEvent<HTMLElement>;

interface Props {
  onClick: (e: Event) => void;
  disabled: boolean;
  className?: string;
  children?: any;
}

export default class ReloadButton extends React.PureComponent<Props> {
  public render() {
    const { onClick, disabled, className, children } = this.props;
    const classes = cx("reload-button", className);

    return (
      <button
        disabled={disabled}
        title="Reload arrivals for stop"
        className={classes}
        onClick={(e: Event) => onClick(e)}
      >
        {disabled && <FontAwesome name="refresh" spin={true} size="2x" />}
        {!disabled && <FontAwesome name="refresh" size="2x" />}
        {children}
      </button>
    );
  }
}
