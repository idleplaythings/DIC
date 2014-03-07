DIC = function DIC()
{
    this._registry = {};
    this._shared = {};
    this._tags = {};
};

DIC.prototype.register = function(name, item, options)
{
    this._register(name, item);
    this._parseOptions(name, item, options)
};

DIC.prototype.get = function(name)
{
    if (this.isMarkedShared(name)) {
        this._instantiateShared(name);
        return this._shared[name];
    }

    return this._create(name);
};

DIC.prototype.getTagged = function(tag)
{
    if (this._tags[tag] instanceof Array) {
        return this._tags[tag];
    }

    return [];
};

DIC.prototype.createNewFromTag = function(tag)
{
    var _dic = new DIC();

    this.getTagged(tag).forEach(function(name) {
        _dic.register(name, this.get(name));
    }.bind(this));

    return _dic;
};

DIC.prototype._register = function(name, item)
{
    this._registry[name] = item;
};

DIC.prototype._parseOptions = function(name, item, options)
{
    options = options === undefined ? {} : options;

    if (this._sharedOptionEnabled(options)) {
        this._markAsShared(name);
    }

    this._getTagsFromOptions(options).forEach(function(tag) {
        this._tag(name, tag);
    }.bind(this));
};

DIC.prototype.isMarkedShared = function(name)
{
    return Object.keys(this._shared).indexOf(name) != -1;
};

DIC.prototype._instantiateShared = function(name)
{
    this._shared[name] = this._shared[name] || this._create(name);
};

DIC.prototype._create = function(name)
{
    if (typeof this._registry[name] === 'undefined') {
        throw new Error("Undefined key: '" + name + "'");
    }

    if (typeof this._registry[name] === 'function') {
        return this._registry[name].call(undefined, this);
    }

    return this._registry[name];
};

DIC.prototype._sharedOptionEnabled = function(options)
{
    return !! options.shared;
};

DIC.prototype._markAsShared = function(name)
{
    this._shared[name] = null;
};

DIC.prototype._getTagsFromOptions = function(options)
{
    if (options.tags instanceof Array) {
        return options.tags;
    }

    return [];
};

DIC.prototype._tag = function(name, tag)
{
    if (typeof this._tags[tag] === 'undefined') {
        this._tags[tag] = [];
    }

    this._tags[tag].push(name);
};
