# Dependency Injection Container

A super simple Dependency Injection Container for applying the [Inversion of Control](https://en.wikipedia.org/wiki/Inversion_of_control) principle in JavaScript.

## Usage

Instantiate the container.

    var dic = new DIC();
    
Register constructor functions by their **logical** names.

    dic.register('Database', function() {
        return new MongoloidDatabaseAdapter();
    });
    
Call constructor functions by their **logical** names;

    // returns a new instance of MongoloidDatabaseAdapter
    dic.get('Logger');
    
Chain constructors to build **object graphs**.

    dic.register('Service', function(dic) {
        return new Service(
            dic.get('Database') // <-- This is where the magic happens
        );
    });
    
Throw some **scalar values** at it, too.

    dic.register('Pi', 3.14);
    
    dig.get('Pi')
    // 3.14
    
Flag constructors shared to only construct a **single instance** of your thing.

    dic.register('SharedService', function() {
        return new SharedService();
    }, {
        shared: true
    });
    
**Tag** constructor functions, and get logical names associated with tags.

    dic.register('one', 1, { tags: [ 'number' ]);
    dic.register('two', 2, { tags: [ 'number' ]);
    dic.register('carrot', '???', { tags: [ 'vegetable' ]);
    
    dic.getTagged('number'); 
    // [ 'one', 'two' ]
    
**Bonus feature:** extract a subset (defined by tag) of the registered constructors into a completely new DIC. (If you are wondering *why*, try and think of this as a FactoryFactory).

    dic.register('one', 1, { tags: [ 'number' ]);
    dic.register('two', 2, { tags: [ 'number' ]);
    dic.register('carrot', '???', { tags: [ 'vegetable' ]);
    
    dic.createNewFromTag('number');
    // returns a completely fresh DIC with 'one' and 'two'
    
## Specs

It's [fully tested](spec/DICSpec.js).

## License

Licensed under MIT license.

    
