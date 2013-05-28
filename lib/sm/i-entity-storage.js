


/**
 * @interface
 * @extends {sm.IEntitySource}
 */
sm.IEntityStorage = function() {};


/**
 * @param {!sm.IEntity} entity Сущность.
 */
sm.IEntityStorage.prototype.save = function(entity) {};


/**
 * @param {!sm.IEntity} entity Сущность.
 */
sm.IEntityStorage.prototype.remove = function(entity) {};


/**
 * @param {string} name Имя типа сущности.
 * @return {!Array.<!sm.IEntity>} Массив сущностей выбранного типа.
 */
sm.IEntityStorage.prototype.select = function(name) {};


/**
 * @param {string} name Имя типа сущности.
 * @return {sm.IEntity} Сущность выбранного типа.
 */
sm.IEntityStorage.prototype.selectOne = function(name) {};


/**
 * @param {string} name Имя типа сущности.
 * @param {string} id Идентификатор сущности.
 * @return {!Array.<!sm.IEntity>} Массив сущностей выбранного типа.
 */
sm.IEntityStorage.prototype.selectById = function(name, id) {};


/**
 * @param {string} fullName Имя сущности.
 * @return {sm.IEntity} Сущность.
 */
sm.IEntityStorage.prototype.selectByName = function(fullName) {};


/**
 * @param {!sm.IEntity} parent Имя типа сущности.
 * @param {string} name Имя типа сущности.
 * @return {!Array.<!sm.IEntity>} Массив сущностей выбранного типа.
 */
sm.IEntityStorage.prototype.selectChildren = function(parent, name) {};


/**
 * Очищение хранилища.
 */
sm.IEntityStorage.prototype.flush = function() {};


/**
 * @param {string} name Имя типа сущности.
 * @param {!function()} listener Функция-обработчик.
 */
sm.IEntityStorage.prototype.addUpdateHandler =
    function(name, listener) {};


/**
 * @param {string} name Имя типа сущности.
 * @param {string} id Идентификатор сущности.
 * @param {!function()} listener Функция-обработчик.
 */
sm.IEntityStorage.prototype.addEntityUpdateHandler =
    function(name, id, listener) {};


/**
 * @param {string} name Имя типа сущности.
 * @param {!function()} listener Функция-обработчик.
 */
sm.IEntityStorage.prototype.removeUpdateListener =
    function(name, listener) {};


/**
 * @param {string} name Имя типа сущности.
 * @param {string} id Идентификатор сущности.
 * @param {!function()} listener Функция-обработчик.
 */
sm.IEntityStorage.prototype.removeEntityUpdateHandler =
    function(name, id, listener) {};
