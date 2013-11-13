

/**
 * @namespace
 */
var sm = {};


/**
 * @type {string}
 */
sm.VERSION = '0.0.1';


/**
 * @type {string}
 */
sm.NAME_SEPARATOR = ':';


/**
 * @type {string}
 */
sm.FIELD_SEPARATOR = '.';


/**
 * @type {string}
 */
sm.PARENT_SEPARATOR = ',';


/**
 * @param {!sm.IEntityFactory} factory Фабрика.
 */
sm.setEntityFactory = function(factory) {
  sm.__factory = factory;
};


/**
 * @param {!sm.IEntitySerializer} serializer Фабрика.
 */
sm.setEntitySerializer = function(serializer) {
  sm.__serializer = serializer;
};


/**
 * @param {string} name Имя сущности.
 * @param {string} id Идентификатор сущности.
 * @param {!Array.<!sm.IEntity>=} opt_parents Родительская сущность.
 * @return {sm.IEntity} Созданная сущность.
 */
sm.createEntity = function(name, id, opt_parents) {
  if (sm.__factory !== null) {
    return sm.__factory.createEntity(name, id, opt_parents);
  }

  return null;
};


/**
 * @param {string} fullName Полное имя сущности.
 * @param {sm.IEntitySource=} opt_source Сущность для поиска общего родителя.
 * @return {sm.IEntity} Созданная сущность.
 */
sm.createEntityByName = function(fullName, opt_source) {
  var idMarkIndex = fullName.lastIndexOf(':');
  var nameMarkIndex = fullName.lastIndexOf(':', idMarkIndex - 1);

  var id = fullName.substring(idMarkIndex + 1);
  var name = fullName.substring(nameMarkIndex + 1, idMarkIndex);

  var entity = null;
  var parent = null;

  if (opt_source !== undefined) {
    entity = opt_source.getEntity(fullName);
  }

  if (entity === null) {
    var parentNames = [];
    var parents = [];

    var parentsSign = fullName.substring(0, nameMarkIndex);
    if (parentsSign.charAt(0) === '(') {
      parentNames =
          sm.__splitName(parentsSign.substr(1, parentsSign.length - 2));
    } else if (parentsSign.length > 0) {
      parentNames = [parentsSign];
    }

    var i = 0,
        l = parentNames.length;

    while (i < l) {
      parent = sm.createEntityByName(parentNames[i], opt_source);

      if (parent !== null) {
        parents.push(parent);
      } else {
        break;
      }

      i += 1;
    }

    if (parents.length === parentNames.length) {
      entity = sm.createEntity(name, id, parents);
    }
  }

  return entity;
};


/**
 * @param {!Array.<!sm.IEntity>} entities Массив сущностей.
 * @return {string} Строка сущностей.
 */
sm.getParentsName = function(entities) {
  if (entities.length < 2) {
    return entities.join(',');
  }

  return '(' + entities.join(',') + ')';
};


/**
 * @param {!Array.<!sm.IEntity>} entities Массив сущностей.
 * @param {string=} opt_type Тип кодирования данных.
 * @return {!Object} Объект даных набора сущностей.
 */
sm.serializeEntities = function(entities, opt_type) {
  if (sm.__serializer !== null) {
    return sm.__serializer.serializeEntities(entities, opt_type);
  }

  return {};
};


/**
 * @param {!sm.IEntity} entity Сущность.
 * @param {string=} opt_type Тип кодирования данных.
 * @return {!Object} Объект даных набора сущностей.
 */
sm.serializeEntity = function(entity, opt_type) {
  return sm.serializeEntities([entity], opt_type);
};


/**
 * @param {!Object} data Объект даных набора сущностей.
 * @param {string=} opt_type Тип кодирования данных.
 * @return {!Array.<!sm.IEntity>} Массив сущностей.
 */
sm.reconstructEntities = function(data, opt_type) {
  if (sm.__serializer !== null) {
    return sm.__serializer.reconstructEntities(data, opt_type);
  }

  return [];
};


/**
 * @param {!Object} data Объект даных набора сущностей.
 * @param {string=} opt_type Тип кодирования данных.
 * @return {sm.IEntity} Сущность.
 */
sm.reconstructEntity = function(data, opt_type) {
  var singleData = {};

  for (var entityId in data) {
    singleData[entityId] = data[entityId];
    break;
  }

  if (entityId !== '') {
    return sm.reconstructEntities(singleData, opt_type)[0] || null;
  }

  return null;
};


/**
 * @param {!sm.IEntityStorage} storage Хранилище.
 */
sm.setEntityStorage = function(storage) {
  sm.__db = storage;
};


/**
 * @param {!sm.IEntity} entity Сущность.
 */
sm.save = function(entity) {
  if (sm.__db !== null) {
    sm.__db.save(entity);
  }
};


/**
 * @param {!sm.IEntity} entity Сущность.
 */
sm.remove = function(entity) {
  if (sm.__db !== null) {
    sm.__db.remove(entity);
  }
};


/**
 * @param {string} name Имя типа сущности.
 * @return {!Array.<!sm.IEntity>} Массив сущностей выбранного типа.
 */
sm.select = function(name) {
  if (sm.__db !== null) {
    return sm.__db.select(name);
  }

  return [];
};


/**
 * @param {string} name Имя типа сущности.
 * @return {sm.IEntity} Сущность.
 */
sm.selectOne = function(name) {
  if (sm.__db !== null) {
    return sm.__db.selectOne(name);
  }

  return null;
};


/**
 * @param {string} name Имя типа сущности.
 * @param {string} id Идентификатор сущности.
 * @return {!Array.<!sm.IEntity>} Массив сущностей выбранного типа.
 */
sm.selectById = function(name, id) {
  if (sm.__db !== null) {
    return sm.__db.selectById(name, id);
  }

  return [];
};


/**
 * @param {string} name Имя типа сущности.
 * @param {string} id Идентификатор сущности.
 * @return {sm.IEntity} Cущность выбранного типа.
 */
sm.selectOneById = function(name, id) {
  if (sm.__db !== null) {
    return sm.__db.selectById(name, id)[0] || null;
  }

  return null;
};


/**
 * @param {string} fullName Имя сущности.
 * @return {sm.IEntity} Сущность.
 */
sm.selectByName = function(fullName) {
  if (sm.__db !== null) {
    return sm.__db.selectByName(fullName);
  }

  return null;
};


/**
 * @param {!sm.IEntity} parent Имя типа сущности.
 * @param {string} name Имя типа сущности.
 * @return {!Array.<!sm.IEntity>} Массив сущностей выбранного типа.
 */
sm.selectChildren = function(parent, name) {
  if (sm.__db !== null) {
    return sm.__db.selectChildren(parent, name);
  }

  return [];
};


/**
 * Очищениу локального хранилища.
 */
sm.flush = function() {
  if (sm.__db !== null) {
    sm.__db.flush();
  }
};


/**
 * @param {string} name Имя типа сущности.
 * @param {!function()} listener Функция-обработчик.
 */
sm.addUpdateHandler = function(name, listener) {
  if (sm.__db !== null) {
    sm.__db.addUpdateHandler(name, listener);
  }
};


/**
 * @param {string} name Имя типа сущности.
 * @param {string} id Идентификатор сущности.
 * @param {!function()} listener Функция-обработчик.
 */
sm.addEntityUpdateHandler = function(name, id, listener) {
  if (sm.__db !== null) {
    sm.__db.addEntityUpdateHandler(name, id, listener);
  }
};


/**
 * @param {string} name Имя типа сущности.
 * @param {!function()} listener Функция-обработчик.
 */
sm.removeUpdateListener = function(name, listener) {
  if (sm.__db !== null) {
    sm.__db.removeUpdateListener(name, listener);
  }
};


/**
 * @param {string} name Имя типа сущности.
 * @param {string} id Идентификатор сущности.
 * @param {!function()} listener Функция-обработчик.
 */
sm.removeEntityUpdateHandler = function(name, id, listener) {
  if (sm.__db !== null) {
    sm.__db.removeEntityUpdateHandler(name, id, listener);
  }
};


/**
 * @type {sm.IEntityFactory}
 */
sm.__factory = null;


/**
 * @type {sm.IEntityStorage}
 */
sm.__db = null;


/**
 * @type {sm.IEntitySerializer}
 */
sm.__serializer = null;


/**
 * @param {string} name Строка.
 * @return {!Array.<string>} Разбитая строка.
 */
sm.__splitName = function(name) {
  var names = [];

  var i = 0,
      b = 0,
      p = 0,
      l = name.length;

  while (i < l) {
    if (name.charAt(i) === '(') {
      b += 1;
    } else if (name.charAt(i) === ')') {
      b -= 1;
    } else if (b === 0 && name.charAt(i) === ',') {
      names.push(name.substring(p, i));
      p = i + 1;
    }

    i += 1;
  }

  names.push(name.substring(p, i));

  return names;
};
