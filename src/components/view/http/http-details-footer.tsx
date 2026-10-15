import * as React from 'react';
import { action } from 'mobx';
import { observer, inject } from 'mobx-react';

import { CollectedEvent, ViewableEvent, HttpExchangeView } from '../../../types';
import { styled, css } from '../../../styles';
import { Ctrl } from '../../../util/ui';

import { RulesStore } from '../../../model/rules/rules-store';
import { AccountStore } from '../../../model/account/account-store';
import { PinColor, PIN_COLOR_NAMES } from '../../../model/events/pin-colors';

import { HEADER_FOOTER_HEIGHT } from '../view-event-list-footer';
import { ProPill } from '../../account/pro-placeholders';
import { IconButton } from '../../common/icon-button';
import { UnstyledButton } from '../../common/inputs';
import { filterProps } from '../../component-utils';

const ButtonsContainer = styled.div`
    height: ${HEADER_FOOTER_HEIGHT}px;
    flex-shrink: 0;
    width: 100%;
    padding-left: 5px;
    box-sizing: border-box;

    background-color: ${p => p.theme.mainBackground};

    display: flex;

    align-items: center;
    justify-content: center;

    z-index: 1;
    box-shadow: 0 -10px 30px -5px rgba(0,0,0,${p => p.theme.boxShadowAlpha});
`;

const ScrollToButton = observer((p: {
    onClick: () => void
}) => <IconButton
    icon={['fas', 'eye']}
    title={'Scroll the list to show this exchange'}
    onClick={p.onClick}
/>);

const PinButton = styled(observer((p: {
    className?: string,
    pinned: boolean,
    pinColor?: PinColor,
    onClick: () => void
}) => <IconButton
    className={p.className}
    icon={['fas', 'thumbtack']}
    title={
        (
            p.pinned
            ? "Unpin this exchange so it can be deleted"
            : "Pin this exchange, so it can't be deleted"
        ) + ` (${Ctrl}+P)`
    }
    onClick={p.onClick}
/>))`
    transition: transform 0.1s;

    ${p => !p.pinned && css`
        transform: rotate(45deg);
    `}

    ${p => p.pinned && p.pinColor && css`
        && {
            color: ${p.theme.pinColors[p.pinColor]};
        }
    `}
`;

const PinColorPopover = styled.div`
    /* Hidden without display: none, so the options stay reachable by keyboard: */
    opacity: 0;
    pointer-events: none;

    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);

    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 5px;
    padding: 8px;

    background-color: ${p => p.theme.mainBackground};
    border: 1px solid ${p => p.theme.containerBorder};
    border-radius: 4px;
    box-shadow: 0 2px 10px 0 rgba(0,0,0,${p => p.theme.boxShadowAlpha});
`;

const PinControls = styled.div`
    position: relative;

    /* Not :focus-within, as mouse clicks focus buttons too, and would keep the options open: */
    &:hover > ${PinColorPopover}, &:has(:focus-visible) > ${PinColorPopover} {
        opacity: 1;
        pointer-events: auto;
    }
`;

const PinColorDot = styled(filterProps(UnstyledButton, 'pinColor', 'active'))<{
    pinColor?: PinColor,
    active: boolean
}>`
    width: 14px;
    height: 14px;
    flex-shrink: 0;
    border-radius: 50%;
    box-sizing: border-box;
    cursor: pointer;

    background-color: ${p => p.pinColor
        ? p.theme.pinColors[p.pinColor]
        : p.theme.mainColor
    };
    border: 2px solid ${p => p.active ? p.theme.popColor : 'transparent'};

    &:hover {
        transform: scale(1.2);
    }
`;

const PinColorOptions = observer((p: {
    event: ViewableEvent
}) => {
    const { event } = p;

    return <PinColorPopover role='group' aria-label='Pin colour options'>
        <PinColorDot
            title='Pin in the default colour'
            active={event.pinned && !event.pinColor}
            onClick={() => event.pin()}
        />
        { PIN_COLOR_NAMES.map((color) =>
            <PinColorDot
                key={color}
                title={`Pin ${color}`}
                pinColor={color}
                active={event.pinColor === color}
                onClick={() => event.pin(color)}
            />
        ) }
    </PinColorPopover>;
});

const DeleteButton = observer((p: {
    pinned: boolean,
    onClick: () => void
}) => <IconButton
    icon={['far', 'trash-alt']}
    title={`Delete this exchange (${Ctrl}+Delete)`}
    onClick={p.onClick}
/>);

const ModifyButton = observer((p: {
    isExchange: boolean,
    isPaidUser: boolean,
    onClick: () => void
}) => <IconButton
    icon='Pencil'
    onClick={p.onClick}
    title={
        p.isPaidUser
            ? `Create a modify rule from this exchange (${Ctrl}+m)`
            : 'With Pro: create a modify rule from this exchange'
    }
    disabled={!p.isExchange || !p.isPaidUser}
/>);

const SendButton = observer((p: {
    isExchange: boolean,
    isPaidUser: boolean,
    onClick: () => void
}) => <IconButton
    icon='PaperPlaneTilt'
    onClick={p.onClick}
    title={p.isPaidUser
        ? `Resend this request (${Ctrl}+r)`
        : 'With Pro: Resend this request'
    }
    disabled={!p.isExchange || !p.isPaidUser}
/>);

const ProSeparator = styled(inject('accountStore')((p: {
    accountStore?: AccountStore,
    className?: string
}) => <UnstyledButton
    onClick={() => p.accountStore!.getPro('http-event-footer')}
    className={p.className}
>
    <ProPill>With Pro:</ProPill>
</UnstyledButton>))`
    padding: 0;
    margin-left: 40px;
`;

export const HttpDetailsFooter = inject('rulesStore')(
    observer(
        (props: {
            rulesStore?: RulesStore,

            event: ViewableEvent,
            onDelete: (event: CollectedEvent) => void,
            onScrollToEvent: (event: CollectedEvent) => void,
            onBuildRuleFromExchange: (event: HttpExchangeView) => void,
            onPrepareToResendRequest?: (event: HttpExchangeView) => void,
            isPaidUser: boolean,
            navigate: (url: string) => void
        }) => {
            const { event } = props;
            const { pinned, pinColor } = event;

            // Some actions require the collected event, not just the
            // current view.
            const collectedEvent = 'downstream' in event
                ? event.downstream
                : event;

            return <ButtonsContainer>
                <ScrollToButton
                    onClick={() => props.onScrollToEvent(collectedEvent)}
                />
                <PinControls>
                    <PinButton
                        pinned={pinned}
                        pinColor={pinColor}
                        onClick={action(() => {
                            event.pinned = !event.pinned;
                        })}
                    />
                    <PinColorOptions event={event} />
                </PinControls>
                <DeleteButton
                    pinned={pinned}
                    onClick={() => props.onDelete(collectedEvent)}
                />

                {
                    !props.isPaidUser &&
                        <ProSeparator />
                }

                <ModifyButton
                    isExchange={event.isHttp() && !event.isWebSocket()}
                    isPaidUser={props.isPaidUser}
                    onClick={() => props.onBuildRuleFromExchange(props.event as HttpExchangeView)}
                />
                { props.onPrepareToResendRequest &&
                    <SendButton
                        isExchange={event.isHttp() && !event.isWebSocket()}
                        isPaidUser={props.isPaidUser}
                        onClick={() => props.onPrepareToResendRequest!(
                            props.event as HttpExchangeView
                        )}
                    />
                }
            </ButtonsContainer>;
        }
    )
);