import * as React from 'react';

type onClick = React.MouseEvent<HTMLElement>;

interface Props {
    onClick: (e: onClick) => void;
}

class ReloadButton extends React.Component<Props> {
    render() {
        return (
            <button
                className="reload-button"
                onClick={(e: onClick) => this.props.onClick(e)}
            >
                Reload
            </button>
        );
    }
}

export default ReloadButton;