


/**
 * @interface
 * @extends {sm.IEntitySource}
 */
sm.IEntity = function() {};


/**
 * @return {string} Идентификатор сущности.
 */
sm.IEntity.prototype.getId = function() {};


/**
 * @return {!Array.<!sm.IEntity>} Родительские сущности.
 */
sm.IEntity.prototype.getParents = function() {};


/**
 * @return {string} Имя сущности.
 */
sm.IEntity.prototype.getName = function() {};


/**
 * @return {string} Полное имя, включеющее имя родителей.
 */
sm.IEntity.prototype.getFullName = function() {};


/**
 * @param {string} key Ключ поля.
 * @return {string} Строковое значение поля.
 */
sm.IEntity.prototype.getField = function(key) {};


/**
 * @param {string} key Ключ поля.
 * @param {string} value Строковое значение поля.
 */
sm.IEntity.prototype.setField = function(key, value) {};


/**
 * @param {string} key Ключ хранения ссылок.
 * @param {!Array.<!sm.IEntity>} entities Сущности.
 */
sm.IEntity.prototype.setLinks = function(key, entities) {};


/**
 * @param {string} key Ключ хранения ссылок.
 * @param {!sm.IEntity} entity Сущность на которую необходимо ссылаться.
 */
sm.IEntity.prototype.addLink = function(key, entity) {};


/**
 * @param {string} key Ключ хранения ссылок.
 * @param {!sm.IEntity} entity Сущность на которую необходимо ссылаться.
 */
sm.IEntity.prototype.removeLink = function(key, entity) {};


/**
 * @param {string} key Ключ хранения ссылок.
 * @param {!sm.IEntity} entity Сущность на которую необходимо ссылаться.
 * @return {boolean} Имеется ли сссылка.
 */
sm.IEntity.prototype.hasLink = function(key, entity) {};


/**
 * @param {string=} opt_type Тип кодирования.
 * @return {!Object} Данные.
 */
sm.IEntity.prototype.serializeData = function(opt_type) {};


/**
 * @param {!Object} data Данные.
 * @param {string=} opt_type Тип кодирования.
 */
sm.IEntity.prototype.populateData = function(data, opt_type) {};
