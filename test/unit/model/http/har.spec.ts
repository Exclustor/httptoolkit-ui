import { expect } from '../../../test-setup';

import { generateHar, parseHar } from '../../../../src/model/http/har';
import { getExchangeData } from '../../unit-test-helpers';

describe('HAR generation', () => {
    it('orders entries chronologically regardless of selection order', async () => {
        const olderExchange = getExchangeData({ statusCode: 403 });
        olderExchange.timingEvents.startTime = Date.parse('2026-07-17T20:35:23.997+01:00');

        const newerExchange = getExchangeData({ statusCode: 200 });
        newerExchange.timingEvents.startTime = Date.parse('2026-07-17T20:36:12.733+01:00');

        const har = await generateHar([newerExchange, olderExchange]);

        expect(har.log.entries.map(entry => entry.response.status))
            .to.deep.equal([403, 200]);
    });

    it('exports default pins as true, and coloured pins as their colour', async () => {
        const defaultPinned = getExchangeData();
        defaultPinned.pin();

        const redPinned = getExchangeData();
        redPinned.pin('red');

        const unpinned = getExchangeData();

        const har = await generateHar([defaultPinned, redPinned, unpinned]);

        expect(har.log.entries.map(entry => entry._pinned))
            .to.deep.equal([true, 'red', undefined]);
    });
});

describe('HAR parsing', () => {
    it('imports pin colours, treating legacy & unknown pin values as default pins', async () => {
        const har = await generateHar([
            getExchangeData(),
            getExchangeData(),
            getExchangeData(),
            getExchangeData(),
            getExchangeData()
        ]);
        har.log.entries[0]._pinned = 'red';
        har.log.entries[1]._pinned = true; // As exported before pins had colours
        har.log.entries[2]._pinned = 'not-a-pin-colour'; // E.g. from a newer version
        har.log.entries[3]._pinned = 'toString'; // Inherited by every object, but not a colour

        const { pinnedIds, pinColorsById } = await parseHar(har);

        expect(pinnedIds.map(id => pinColorsById[id]))
            .to.deep.equal(['red', undefined, undefined, undefined]);
    });
});
