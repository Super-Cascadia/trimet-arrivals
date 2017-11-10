import * as React from 'react';
import * as FontAwesome from 'react-fontawesome';
import * as cx from 'classnames';

export type Event = React.MouseEvent<HTMLElement>;

interface Props {
    onClick: (e: Event) => void;
    disabled: boolean;
    className?: string;
}

interface DefaultProps {
    className: string;
}

type PropsWithDefaults = Props & DefaultProps;

class ReloadButton extends React.PureComponent<Props> {
    render() {
        const { onClick, disabled, className } = this.props as PropsWithDefaults;
        const classes = cx('reload-button', className);

        return (
            <button
                disabled={disabled}
                title="Reload arrivals for stop"
                className={classes}
                onClick={(e: Event) => onClick(e)}
            >
                { disabled &&
                    <FontAwesome name="refresh" spin size="2x" />
                }
                { !disabled &&
                    <FontAwesome name="refresh" size="2x"/>
                }
            </button>
        );
    }
}

export default ReloadButton;