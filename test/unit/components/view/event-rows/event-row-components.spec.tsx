import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { expect } from '../../../../test-setup';

import { ThemeProvider, lightTheme } from '../../../../../src/styles';
import { PinColor } from '../../../../../src/model/events/pin-colors';
import {
    EventListRow,
    RowPin
} from '../../../../../src/components/view/event-rows/event-row-components';

describe('RowPin', () => {

    let container: HTMLDivElement;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach(() => {
        ReactDOM.unmountComponentAtNode(container);
        container.remove();
    });

    function renderPinColor(options: { selected: boolean, pinColor?: PinColor }) {
        ReactDOM.render(
            <ThemeProvider theme={lightTheme}>
                <EventListRow role='row' className={options.selected ? 'selected' : ''}>
                    <RowPin pinned={true} pinColor={options.pinColor} />
                </EventListRow>
            </ThemeProvider>,
            container
        );
        // The icon is painted by the path's fill, which doesn't always follow the svg's color:
        return getComputedStyle(container.querySelector('svg path')!).fill;
    }

    // Normalizes any CSS colour into the rgb() form that getComputedStyle returns:
    function asComputedColor(color: string) {
        const probe = document.createElement('span');
        probe.style.color = color;
        container.appendChild(probe);
        return getComputedStyle(probe).color;
    }

    it('shows its pin colour', () => {
        expect(renderPinColor({ selected: false, pinColor: 'red' }))
            .to.equal(asComputedColor(lightTheme.pinColors.red));
    });

    it('keeps its pin colour when its row is selected', () => {
        expect(renderPinColor({ selected: true, pinColor: 'red' }))
            .to.equal(asComputedColor(lightTheme.pinColors.red));
    });

    it('uses the selected row colour for default pins', () => {
        expect(renderPinColor({ selected: true }))
            .to.equal(asComputedColor(lightTheme.highlightColor));
    });

});
