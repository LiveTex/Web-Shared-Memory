


/**
 * @interface
 */
sm.IEntitySource = function() {};


/**
 * @param {string} name Тип кодирования данных.
 * @param {string} id Тип кодирования данных.
 * @return {sm.IEntity} Объект данных набора сущностей.
 */
sm.IEntitySource.prototype.getEntity = function(name, id) {};
