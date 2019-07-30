const scraper = require('./scraper');
const url = `https://news.ycombinator.com/news?p=1`;

describe('getPages()', () => {
    it('should round up number of posts to the largest whole number', () => {
        expect(scraper.getPages(70)).toBe(3);
    });
});

describe('getHTML()', () => {
    it('should return a HTML page as a string', async () => {
        const data = await scraper.getHTML(url);
        expect(typeof data).toBe('string');
    });
});

describe('getPageNumber()', () => {
    it('should return a page number from a url e.g. 1', () => {
        expect(scraper.getPageNumber(url)).toBe(1);
    });
});

describe('extractHTML()', () => {
    it('should return an array containing a post objects', async () => {
        const data = await scraper.getHTML(url);
        const results = scraper.extractHTML(data, 2)

        expect(results).toEqual(expect.arrayContaining([
            expect.objectContaining({
                title: expect.any(String),
                uri: expect.any(String),
                author: expect.any(String),
                points: expect.any(Number),
                comments: expect.any(Number),
                rank: expect.any(Number)
            })
        ]));
    });
});

describe('stringChecker()', () => {
    it('should return the string if its less than 256 characters and reduce characters and concatenate ... if its over 256 characters', () => {
        const title = 'Middle-aged vlogger who used filter to look young caught in live-stream glitch';
        expect(scraper.stringChecker(title).length).toBeLessThanOrEqual(256)
        expect(scraper.stringChecker(title).length).toBeGreaterThan(1)
    });
});

describe('uriChecker()', () => {
    it('should follow the RFC 3986 URI syntax', () => {
        let regex = /((?<=\()[A-Za-z][A-Za-z0-9\+\.\-]*:([A-Za-z0-9\.\-_~:/\?#\[\]@!\$&'\(\)\*\+,;=]|%[A-Fa-f0-9]{2})+(?=\)))|([A-Za-z][A-Za-z0-9\+\.\-]*:([A-Za-z0-9\.\-_~:/\?#\[\]@!\$&'\(\)\*\+,;=]|%[A-Fa-f0-9]{2})+)/;
        expect(scraper.stringChecker(url)).toMatch(regex)
    });
});

describe('pointsChecker()', () => {
    it('should return a positive integer or 0 if there is no number', () => {
        expect(scraper.pointsChecker(40)).toBe(40)
    })
})