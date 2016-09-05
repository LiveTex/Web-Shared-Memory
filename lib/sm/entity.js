


/**
 * Класс сушности данных.
 *
 * @constructor
 * @implements {sm.IEntity}
 * @param {string} name Имя сущьности.
 * @param {string} id Идентификатор сущности.
 * @param {!Array.<!sm.IEntity>=} opt_parents Родительская сущность.
 */
sm.Entity = function(name, id, opt_parents) {
  var parentSign = '';
  if (opt_parents !== undefined && opt_parents.length > 0) {
    parentSign = sm.getParentsName(opt_parents) + sm.NAME_SEPARATOR;
  }

  /**
   * @type {string}
   */
  this.__id = id;

  /**
   * @type {string}
   */
  this.__entityName = name;

  /**
   * @type {!Array.<sm.IEntity>}
   */
  this.__parents = opt_parents || [];

  /**
   * @type {string}
   */
  this.__fullEntityName = parentSign + name + sm.NAME_SEPARATOR + id;
};


/**
 * @inheritDoc
 */
sm.Entity.prototype.getId = function() {
  return this.__id;
};


/**
 * @inheritDoc
 */
sm.Entity.prototype.getParents = function() {
  return this.__parents;
};


/**
 * @inheritDoc
 */
sm.Entity.prototype.getEntity = function(fullName) {
  var result = null;

  if (this.__fullEntityName === fullName) {
    result = this;
  }

  var i = 0,
      l = this.__parents.length;

  while (result === null && i < l) {
    result = this.__parents[i].getEntity(fullName);
    i += 1;
  }

  return result;
};


/**
 * @inheritDoc
 */
sm.Entity.prototype.getName = function() {
  return this.__entityName;
};


/**
 * @inheritDoc
 */
sm.Entity.prototype.getFullName = function() {
  return this.__fullEntityName;
};


/**
 * @inheritDoc
 */
sm.Entity.prototype.getField = function(key) {
  return '';
};


/**
 * @inheritDoc
 */
sm.Entity.prototype.setField = function(key, value) {};


/**
 * @param {string} linkName Имя ссылки.
 * @return {Array.<!sm.Entity>} Коллекция.
 */
sm.Entity.prototype._getLinksCollection = function(linkName) {
  return null;
};


/**
 * @param {string} linkName Ключ хранения ссылок.
 * @param {!Array.<!sm.IEntity>} entities Сущности.
 */
sm.Entity.prototype.setLinks = function(linkName, entities) {
  var collection = this._getLinksCollection(linkName);
  if (collection !== null) {
    var entity = null;

    var table = {};
    var i = 0,
        l = entities.length;

    while (i < l) {
      entity = entities[i];

      table[entity.getFullName()] = entity;

      i += 1;
    }

    i = collection.length - 1;

    while (i >= 0) {
      entity = collection[i];

      if (table[entity.getFullName()] === undefined) {
        collection.splice(i, 1);
      } else {
        delete table[entity.getFullName()];
      }

      i -= 1;
    }

    for (var name in table) {
      collection.push(table[name]);
    }
  }
};


/**
 * @inheritDoc
 */
sm.Entity.prototype.addLink = function(linkName, entity) {
  var collection = this._getLinksCollection(linkName);
  if (collection !== null && entity instanceof sm.Entity) {
    collection.push(entity);
  }
};


/**
 * @inheritDoc
 */
sm.Entity.prototype.removeLink = function(linkName, entity) {
  var collection = this._getLinksCollection(linkName);
  if (collection !== null) {
    var i = 0,
        l = collection.length;

    while (i < l) {
      if (collection[i].getId() === entity.getId()) {
        collection.splice(i, 1);
      }

      i += 1;
    }
  }
};


/**
 * @param {string} linkName Ключ хранения ссылок.
 * @param {!sm.IEntity} entity Сущность на которую необходимо ссылаться.
 * @return {boolean} Имеется ли сссылка.
 */
sm.Entity.prototype.hasLink = function(linkName, entity) {
  var collection = this._getLinksCollection(linkName);
  if (collection !== null) {
    var i = 0,
        l = collection.length;

    while (i < l) {
      if (collection[i].getId() === entity.getId()) {
        return true;
      }

      i += 1;
    }
  }

  return false;
};


/**
 * @inheritDoc
 */
sm.Entity.prototype.serializeData = function(opt_type) {
  return {};
};


/**
 * @inheritDoc
 */
sm.Entity.prototype.populateData = function(data, opt_type) {};


/**
 * @inheritDoc
 * @final
 */
sm.Entity.prototype.toString = function() {
  return this.__fullEntityName;
};
