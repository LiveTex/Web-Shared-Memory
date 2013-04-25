


/**
 * @constructor
 * @implements {sm.IEntitySerializer}
 * @param {!sm.IEntityStorage} storage Храниидище.
 */
sm.EntitySerializer = function(storage) {

  /**
   * @type {!sm.IEntityStorage}
   */
  this.__storage = storage;
};


/**
 * @param {!Array.<!sm.IEntity>} items Массив сущностей.
 * @param {string=} opt_type Тип кодирования данных.
 * @return {!Object} Объект даных набора сущностей.
 */
sm.EntitySerializer.prototype.serializeEntities = function(items, opt_type) {
  var result = {};

  var i = 0,
      l = items.length;

  while (i < l) {
    var entity = items[i];

    result[entity.getFullName()] = entity.serializeData(opt_type);

    i += 1;
  }

  return result;
};


/**
 * @param {!Object} data Объект даных набора сущностей.
 * @param {string=} opt_type Тип кодирования данных.
 * @return {!Array.<!sm.IEntity>} Массив сущностей.
 */
sm.EntitySerializer.prototype.reconstructEntities = function(data, opt_type) {
  var result = [];

  for (var name in data) {
    var entity = sm.createEntityByName(name, this.__storage);
    if (entity !== null && data[name] instanceof Object) {

      entity.populateData(data[name], opt_type);
      result.push(entity);

      this.__storage.save(entity);
    }
  }

  return result;
};
