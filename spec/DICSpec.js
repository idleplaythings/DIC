describe("Dependency Injection Container", function() {
    var dic;

    beforeEach(function() {
        dic = new DIC();
    });

    it("returns scalar values", function() {
        dic.register('Pi', 3.14);

        expect(dic.get('Pi')).toEqual(3.14);
    });

    it("throws an error for non-existing names", function () {
        expect(function() {
            dic.get("foo");
        }).toThrow("Undefined key: 'foo'");
    });

    it("executes constructor functions", function() {
        var Bar = function() { };

        dic.register('Foo', function() {
            return new Bar();
        });

        expect(dic.get('Foo') instanceof Bar).toEqual(true);
    });

    it("passes itself as a parameter to constructor functions", function() {
        dic.register('first', 1);
        dic.register('second', function(dic) {
            return dic.get('first');
        });

        expect(dic.get('second')).toEqual(1);
    });

    it("executes shared constructor functions only once", function() {
        var Bar = function() { };

        dic.register('Foo', function() {
            return new Bar();
        }, {
            shared: true
        });

        expect(dic.get('Foo')).toBe(dic.get('Foo'));
    });

    it("returns logical names by tags", function() {
        dic.register('two',   2, { tags: [ 'prime', 'even' ] });
        dic.register('three', 3, { tags: [ 'prime', 'odd' ] });
        dic.register('four',  4, { tags: [ 'even' ] });

        var tagged = dic.getTagged('prime');

        expect(tagged).toContain('two');
        expect(tagged).toContain('three');
        expect(tagged.length).toEqual(2);
    });

    it("returns an empty array for non-existing tag", function() {
        expect(dic.getTagged('foobar').length).toEqual(0);
    })

    it("creates a new DIC based on tagged subset of itself", function () {
        dic.register('one',   1, { tags: [ 'leave-me' ] });
        dic.register('two',   2, { tags: [ 'pick-me' ] });
        dic.register('three', 3, { tags: [ 'pick-me' ] });
        dic.register('four',  4, { tags: [ 'leave-me' ] });

        var anotherDic = dic.createNewFromTag('pick-me');

        expect(anotherDic.get('two')).toEqual(2);
        expect(anotherDic.get('three')).toEqual(3);
    });
});
