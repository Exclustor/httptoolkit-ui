import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { expect } from '../../../test-setup';

import { ThemeProvider, lightTheme } from '../../../../src/styles';
import { ViewableEvent } from '../../../../src/types';
import { EventNoteDialog } from '../../../../src/components/view/event-note-dialog';
import { getExchangeData } from '../../unit-test-helpers';

describe('EventNoteDialog', () => {

    let container: HTMLDivElement;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach(() => {
        ReactDOM.unmountComponentAtNode(container);
        container.remove();
    });

    function renderNoteText(events: ViewableEvent[]) {
        ReactDOM.render(
            <ThemeProvider theme={lightTheme}>
                <EventNoteDialog events={events} onClose={() => {}} />
            </ThemeProvider>,
            container
        );
        return document.querySelector('textarea')!.value;
    }

    it('is pre-filled with the existing note when editing one event', () => {
        const event = getExchangeData();
        event.note = 'Login request';

        expect(renderNoteText([event])).to.equal('Login request');
    });

    it('starts empty when adding a note to multiple events', () => {
        const notedEvent = getExchangeData();
        notedEvent.note = 'Login request';

        expect(renderNoteText([notedEvent, getExchangeData()])).to.equal('');
    });

});
