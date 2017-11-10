import * as React from 'react';
import * as FontAwesome from 'react-fontawesome';

export type Event = React.MouseEvent<HTMLElement>;

interface Props {
    onClick: (e: Event) => void;
    disabled: boolean;
}

class ReloadButton extends React.PureComponent<Props> {
    render() {
        const { onClick, disabled } = this.props;

        return (
            <button
                disabled={disabled}
                title="Reload arrivals for stop"
                className="reload-button"
                onClick={(e: Event) => onClick(e)}
            >
                { disabled &&
                    <FontAwesome name="refresh" spin />
                }
                { !disabled &&
                    <FontAwesome name="refresh"/>
                }
            </button>
        );
    }
}

export default ReloadButton;