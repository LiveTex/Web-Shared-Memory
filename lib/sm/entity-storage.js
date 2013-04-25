


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
   * @type {!Object.<string, !Object.<string, !sm.IEntity>>}
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
sm.EntityStorage.prototype.getEntity = function(name, id) {
  return this.selectById(name, id);
};


/**
 * @param {!sm.IEntity} entity Сущность.
 */
sm.EntityStorage.prototype.save = function(entity) {
  this.__entities[entity.getFullName()] = entity;

  var parents = entity.getParents();
  var name = entity.getName();
  var id = entity.getId();

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
    this.__types[name][id] = entity;
  }

  if (this.__updates[name] === undefined) {
    this.__updates[name] = [id];
  } else {
    this.__updates[name].push(id);
  }

  this.__dispatchNextTick();
};


/**
 * @param {!sm.IEntity} entity Сущность.
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
    delete this.__types[name][id];
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
 * @param {string} name Имя типа сущности.
 * @return {!Array.<!sm.IEntity>} Массив сущностей выбранного типа.
 */
sm.EntityStorage.prototype.select = function(name) {
  var result = [];

  if (this.__types[name] !== undefined) {
    for (var id in this.__types[name]) {
      result.push(this.__types[name][id]);
    }
  }

  return result;
};


/**
 * @param {string} name Имя типа сущности.
 * @return {sm.IEntity} Массив сущностей выбранного типа.
 */
sm.EntityStorage.prototype.selectOne = function(name) {
  if (this.__types[name] !== undefined) {
    for (var id in this.__types[name]) {
      return this.__types[name][id];
    }
  }

  return null;
};


/**
 * @param {string} name Имя типа сущности.
 * @param {string} id Идентификатор сущности.
 * @return {sm.IEntity} Сущность.
 */
sm.EntityStorage.prototype.selectById = function(name, id) {
  if (this.__types[name] !== undefined &&
      this.__types[name][id] !== undefined) {
    return this.__types[name][id];
  }

  return null;
};


/**
 * @param {string} fullName Имя сущности.
 * @return {sm.IEntity} Сущность.
 */
sm.EntityStorage.prototype.selectByName = function(fullName) {
  return this.__entities[fullName] || null;
};


/**
 * @param {!sm.IEntity} parent Имя типа сущности.
 * @param {string} name Имя типа сущности.
 * @return {!Array.<!sm.IEntity>} Массив сущностей выбранного типа.
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
 * Очищение хранилища.
 */
sm.EntityStorage.prototype.flush = function() {
  for (var fullName in this.__entities) {
    this.remove(this.__entities[fullName]);
  }
};


/**
 * @param {string} name Имя типа сущности.
 * @param {!function()} listener Функция-обработчик.
 */
sm.EntityStorage.prototype.addUpdateHandler = function(name, listener) {
  this.__dispatcher.addEventListener(name, listener);
};


/**
 * @param {string} name Имя типа сущности.
 * @param {string} id Идентификатор сущности.
 * @param {!function()} listener Функция-обработчик.
 */
sm.EntityStorage.prototype.addEntityUpdateHandler =
    function(name, id, listener) {
      this.__dispatcher.addEventListener(name + ':' + id, listener);
    };


/**
 * @param {string} name Имя типа сущности.
 * @param {!function()} listener Функция-обработчик.
 */
sm.EntityStorage.prototype.removeUpdateListener =
    function(name, listener) {
      this.__dispatcher.removeEventListener(name, listener);
    };


/**
 * @param {string} name Имя типа сущности.
 * @param {string} id Идентификатор сущности.
 * @param {!function()} listener Функция-обработчик.
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