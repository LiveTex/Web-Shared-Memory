


/**
 * @interface
 */
sm.IEntityFactory = function() {};


/**
 * @param {string} name Имя сущности.
 * @param {string} id Идентификатор сущности.
 * @param {!Array.<!sm.IEntity>=} opt_parents Родительская сущность.
 * @return {sm.IEntity} Созданная сущность.
 */
sm.IEntityFactory.prototype.createEntity = function(name, id, opt_parents) {};
