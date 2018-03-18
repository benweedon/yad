'use strict';

let expect = chai.expect;

describe('yiddishRegex', function() {
    const regex = yiddishRegex();

    function assertMatches(str) {
        let match = str.match(regex);
        expect(match).not.to.be.null;
        expect(match).to.have.lengthOf(1);
    }

    it('should match single characters', function() {
        assertMatches('א');
        assertMatches('אַ');
        assertMatches('אָ');
        assertMatches('ב');
        assertMatches('בּ');
        assertMatches('בֿ');
        assertMatches('ג');
        assertMatches('ד');
        assertMatches('ה');
        assertMatches('ו');
        assertMatches('וּ');
        assertMatches('וֹ');
        assertMatches('װ');
        assertMatches('ױ');
        assertMatches('ז');
        assertMatches('ח');
        assertMatches('ט');
        assertMatches('י');
        assertMatches('יִ');
        assertMatches('ײ');
        assertMatches('ײַ');
        assertMatches('כ');
        assertMatches('כּ');
        assertMatches('ך');
        assertMatches('ל');
        assertMatches('מ');
        assertMatches('ם');
        assertMatches('נ');
        assertMatches('ן');
        assertMatches('ס');
        assertMatches('ע');
        assertMatches('פ');
        assertMatches('פּ');
        assertMatches('פֿ');
        assertMatches('ף');
        assertMatches('צ');
        assertMatches('ץ');
        assertMatches('ק');
        assertMatches('ר');
        assertMatches('ש');
        assertMatches('שׂ');
        assertMatches('ת');
        assertMatches('תּ');
    });
});
