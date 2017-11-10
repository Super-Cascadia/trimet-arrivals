import * as React from 'react';

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
                className="reload-button"
                onClick={(e: Event) => onClick(e)}
            >
                Reload
            </button>
        );
    }
}

export default ReloadButton;