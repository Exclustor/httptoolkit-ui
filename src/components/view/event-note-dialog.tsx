import * as React from 'react';
import { action } from 'mobx';

import { ViewableEvent } from '../../types';
import { styled } from '../../styles';
import { Icon } from '../../icons';

import { Button, SecondaryButton, UnstyledButton } from '../common/inputs';
import { AppModal } from '../common/modal';

const Dialog = styled(AppModal)`
    background-color: ${p => p.theme.mainBackground};
    color: ${p => p.theme.mainColor};
    border: 1px solid ${p => p.theme.containerBorder};
    border-radius: 4px;

    box-shadow: 0 2px 30px rgba(0, 0, 0, 0.3);

    width: 90%;
    max-width: 550px;

    display: flex;
    flex-direction: column;
`;

const Header = styled.header`
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 20px 24px;
    border-bottom: 1px solid ${p => p.theme.containerBorder};

    h1 {
        font-size: ${p => p.theme.loudHeadingSize};
        font-weight: bold;
        letter-spacing: -0.5px;
    }
`;

const CloseButton = styled(UnstyledButton)`
    color: ${p => p.theme.mainColor};
    opacity: 0.7;
    font-size: 20px;
    padding: 4px 8px;

    &:hover, &:focus {
        opacity: 1;
        outline: none;
    }
`;

const NoteTextArea = styled.textarea`
    margin: 16px 24px;

    font-size: ${p => p.theme.textInputFontSize};
    font-family: inherit;
    padding: 5px 10px;
    border-radius: 4px;
    border: solid 1px ${p => p.theme.inputBorder};

    background-color: ${p => p.theme.inputBackground};
    color: ${p => p.theme.inputColor};

    &::placeholder {
        color: ${p => p.theme.inputPlaceholderColor};
    }

    resize: vertical;
    min-height: 100px;
`;

const Footer = styled.footer`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;

    padding: 0 24px 20px;
`;

export const EventNoteDialog = (props: {
    events: ReadonlyArray<ViewableEvent>,
    onClose: () => void
}) => {
    const { events, onClose } = props;

    // Pre-fill with the existing note, when editing a single event's note:
    const [noteText, setNoteText] = React.useState(events[0]?.note ?? '');

    const saveNote = action(() => {
        events.forEach((event) => { event.note = noteText.trim(); });
        onClose();
    });

    const onKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
            saveNote();
        }
    };

    const title = events.length > 1
        ? `Add a note to ${events.length} events`
    : events[0]?.note
        ? 'Edit note'
        : 'Add a note';

    return <Dialog
        onClose={onClose}
        backdropOpacity={0.6}
        aria-labelledby='event-note-title'
    >
        <Header>
            <h1 id='event-note-title'>{ title }</h1>
            <CloseButton title='Close' onClick={onClose}>
                <Icon icon={['fas', 'times']} />
            </CloseButton>
        </Header>

        <NoteTextArea
            autoFocus
            placeholder='What is notable about this traffic?'
            value={noteText}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNoteText(e.target.value)}
            onKeyDown={onKeyDown}
        />

        <Footer>
            <SecondaryButton onClick={onClose}>
                Cancel
            </SecondaryButton>
            <Button onClick={saveNote}>
                Save Note
            </Button>
        </Footer>
    </Dialog>;
};
