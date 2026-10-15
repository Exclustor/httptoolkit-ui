import { expect } from '../../../test-setup';

import { getExchangeData } from '../../unit-test-helpers';

describe('Event pinning', () => {

    it('pins in the given colour', () => {
        const event = getExchangeData();
        event.pin('red');

        expect(event.pinned).to.equal(true);
        expect(event.pinColor).to.equal('red');
    });

    it('pins in the default colour if none is given', () => {
        const event = getExchangeData();
        event.pin('red');
        event.pin();

        expect(event.pinned).to.equal(true);
        expect(event.pinColor).to.equal(undefined);
    });

    it('resets the colour when unpinned', () => {
        const event = getExchangeData();
        event.pin('red');
        event.pinned = false;
        event.pinned = true;

        expect(event.pinColor).to.equal(undefined);
    });

});
