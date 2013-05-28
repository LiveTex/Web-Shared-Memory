


/**
 * @constructor
 * @implements {sm.IEntityStorage}
 */
sm.EntityStorage = function() {
  var isDispatchRequested = false;
  var self = this;

  function dispatchUpdate() {
    isDispatchRequested = false;
    self.__dispatchUpdates();
  }


  /**
   * @type {!Object.<string, !sm.IEntity>}
   */
  this.__entities = {};

  /**
   * @type {!Object.<string, !Object.<string, !Object.<string, !sm.IEntity>>>}
   */
  this.__children = {};

  /**
   * @type {!Object.<string, !Object.<string, !Array.<string>>>}
   */
  this.__types = {};

  /**
   * @type {!events.EventDispatcher}
   */
  this.__dispatcher = new events.EventDispatcher();

  /**
   * @type {!Object.<string, !Array.<string>>}
   */
  this.__updates = {};

  /**
   *
   */
  this.__dispatchNextTick = function() {
    if (!isDispatchRequested) {
      isDispatchRequested = true;
      util.async(dispatchUpdate);
    }
  };
};


/**
 * @inheritDoc
 */
sm.EntityStorage.prototype.getEntity = function(fullName) {
  return this.selectByName(fullName);
};


/**
 * @inheritDoc
 */
sm.EntityStorage.prototype.save = function(entity) {
  var parents = entity.getParents();
  var fullName = entity.getFullName();
  var name = entity.getName();
  var id = entity.getId();

  this.__entities[fullName] = entity;

  for (var i = 0, l = parents.length; i < l; i += 1) {
    var parent = parents[i];
    var parentName = parent.getFullName();

    if (this.__children[parentName] === undefined) {
      this.__children[parentName] = {};
    }

    if (this.__children[parentName][name] === undefined) {
      this.__children[parentName][name] = {};
    }

    if (this.__children[parentName][name][id] === undefined) {
      this.__children[parentName][name][id] = entity;
    }

    this.save(parent);
  }

  if (this.__types[name] === undefined) {
    this.__types[name] = {};
  }

  if (this.__types[name][id] === undefined) {
    this.__types[name][id] = [fullName];
  } else if (util.indexOf(fullName, this.__types[name][id]) === -1) {
    this.__types[name][id].push(fullName);
  }


  if (this.__updates[name] === undefined) {
    this.__updates[name] = [id];
  } else {
    this.__updates[name].push(id);
  }

  this.__dispatchNextTick();
};


/**
 * @inheritDoc
 */
sm.EntityStorage.prototype.remove = function(entity) {
  var fullName = entity.getFullName();
  var parents = entity.getParents();
  var name = entity.getName();
  var id = entity.getId();

  for (var i = 0, l = parents.length; i < l; i += 1) {
    var parentName = parents[i].getFullName();

    if (this.__children[parentName] !== undefined &&
        this.__children[parentName][name] !== undefined &&
        this.__children[parentName][name][id] !== undefined) {
      delete this.__children[parentName][name][id];
    }
  }

  if (this.__types[name] !== undefined &&
      this.__types[name][id] !== undefined) {
    var names = this.__types[name][id];

    var index = util.indexOf(fullName, names);
    if (index !== -1) {
      names.splice(index, 1);

      if (names.length === 0) {
        delete this.__types[name][id];
      }
    }
  }

  var children = this.__children[fullName];
  if (children !== undefined) {
    for (var childType in children) {
      for (var childId in children[childType]) {
        this.remove(children[childType][childId]);
      }
    }
  }

  delete this.__entities[fullName];

  if (this.__updates[name] === undefined) {
    this.__updates[name] = [id];
  } else {
    this.__updates[name].push(id);
  }

  this.__dispatchNextTick();
};


/**
 * @inheritDoc
 */
sm.EntityStorage.prototype.select = function(name) {
  var result = [];

  for (var id in this.__types[name]) {
    var names = this.__types[name][id];

    for (var i = 0, l = names.length; i < l; i += 1) {
      if (this.__entities[names[i]] !== undefined) {
        result.push(this.__entities[names[i]]);
      }
    }
  }

  return result;
};


/**
 * @inheritDoc
 */
sm.EntityStorage.prototype.selectOne = function(name) {
  for (var id in this.__types[name]) {
    var names = this.__types[name][id];

    for (var i = 0, l = names.length; i < l; i += 1) {
      if (this.__entities[names[i]] !== undefined) {
        return this.__entities[names[i]];
      }
    }
  }

  return null;
};


/**
 * @inheritDoc
 */
sm.EntityStorage.prototype.selectById = function(name, id) {
  var result = [];

  if (this.__types[name] !== undefined &&
      this.__types[name][id] !== undefined) {
    var names = this.__types[name][id];

    for (var i = 0, l = names.length; i < l; i += 1) {
      if (this.__entities[names[i]] !== undefined) {
        result.push(this.__entities[names[i]]);
      }
    }
  }

  return result;
};


/**
 * @inheritDoc
 */
sm.EntityStorage.prototype.selectByName = function(fullName) {
  return this.__entities[fullName] || null;
};


/**
 * @inheritDoc
 */
sm.EntityStorage.prototype.selectChildren = function(parent, name) {
  var result = [];

  var children = this.__children[parent.getFullName()];
  if (children !== undefined && children[name] !== undefined) {
    for (var id in children[name]) {
      result.push(children[name][id]);
    }
  }

  return result;
};


/**
 * @inheritDoc
 */
sm.EntityStorage.prototype.flush = function() {
  for (var fullName in this.__entities) {
    this.remove(this.__entities[fullName]);
  }
};


/**
 * @inheritDoc
 */
sm.EntityStorage.prototype.addUpdateHandler = function(name, listener) {
  this.__dispatcher.addEventListener(name, listener);
};


/**
 * @inheritDoc
 */
sm.EntityStorage.prototype.addEntityUpdateHandler =
    function(name, id, listener) {
  this.__dispatcher.addEventListener(name + ':' + id, listener);
};


/**
 * @inheritDoc
 */
sm.EntityStorage.prototype.removeUpdateListener =
    function(name, listener) {
  this.__dispatcher.removeEventListener(name, listener);
};


/**
 * @inheritDoc
 */
sm.EntityStorage.prototype.removeEntityUpdateHandler =
    function(name, id, listener) {
  this.__dispatcher.removeEventListener(name + ':' + id, listener);
};


/**
 *
 */
sm.EntityStorage.prototype.__dispatchUpdates = function() {
  var updates = this.__updates;

  this.__updates = {};

  for (var name in updates) {
    var ids = updates[name];
    var i = 0,
        l = ids.length;

    while (i < l) {
      this.__dispatcher.dispatch(
          new events.Event(this.__dispatcher, name + ':' + ids[i]));

      i += 1;
    }

    this.__dispatcher.dispatch(
        new events.Event(this.__dispatcher, name));
  }
};
