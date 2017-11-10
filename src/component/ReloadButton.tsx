import * as React from 'react';

export type Event = React.MouseEvent<HTMLElement>;

interface Props {
    onClick: (e: Event) => void;
}

class ReloadButton extends React.PureComponent<Props> {
    render() {
        return (
            <button
                className="reload-button"
                onClick={(e: Event) => this.props.onClick(e)}
            >
                Reload
            </button>
        );
    }
}

export default ReloadButton;