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

    it('should match longer words', function() {
        assertMatches('אבג');
        assertMatches('   אבג ');
        assertMatches('אבג ');
        assertMatches(' אבג');
    });

    it('should handle surrounding punctuation properly', function() {
        assertMatches('`א~');
        assertMatches('!א@');
        assertMatches('#א$');
        assertMatches('%א^');
        assertMatches('&א*');
        assertMatches('(א)');
        assertMatches('-א_');
        assertMatches('+א=');
        assertMatches('{א}');
        assertMatches('[א]');
        assertMatches('\\א|');
        assertMatches(';א:');
        assertMatches('\'א"');
        assertMatches('<א>');
        assertMatches(',א.');
        assertMatches('/א?');
    });
});

describe('normalize', function() {
    it('should normalize individual characters', function() {
        expect(normalize('א\u05B7')).to.equal('אַ');
        expect(normalize('א\u05B8')).to.equal('אָ');
        expect(normalize('ב\u05BC')).to.equal('בּ');
        expect(normalize('ב\u05BF')).to.equal('בֿ');
        expect(normalize('ו\u05BC')).to.equal('וּ');
        expect(normalize('ו\u05B9')).to.equal('וֹ');
        expect(normalize('ו\u05BA')).to.equal('וֹ');
        expect(normalize('י\u05B4')).to.equal('יִ');
        expect(normalize('יי\u05B7')).to.equal('ײַ');
        expect(normalize('ײ\u05B7')).to.equal('ײַ');
        expect(normalize('כ\u05BC')).to.equal('כּ');
        expect(normalize('פ\u05BC')).to.equal('פּ');
        expect(normalize('פ\u05BF')).to.equal('פֿ');
        expect(normalize('ש\u05C2')).to.equal('שׂ');
        expect(normalize('ת\u05BC')).to.equal('תּ');
    });

    it('should normalize multiple instances of the same character', function() {
        expect(normalize('א\u05B7א\u05B7')).to.equal('אַאַ');
    });
});
