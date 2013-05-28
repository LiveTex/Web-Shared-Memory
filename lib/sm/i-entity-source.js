


/**
 * @interface
 */
sm.IEntitySource = function() {};


/**
 * @param {string} fullName Полное имя сущности.
 * @return {sm.IEntity} Объект сущностей.
 */
sm.IEntitySource.prototype.getEntity = function(fullName) {};
