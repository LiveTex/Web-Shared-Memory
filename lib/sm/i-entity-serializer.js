


/**
 * @interface
 */
sm.IEntitySerializer = function() {};


/**
 * @param {!Array.<!sm.IEntity>} items Массив сущностей.
 * @param {string=} opt_type Тип кодирования данных.
 * @return {!Object} Объект даных набора сущностей.
 */
sm.IEntitySerializer.prototype.serializeEntities =
    function(items, opt_type) {};


/**
 * @param {!Object} data Объект даных набора сущностей.
 * @param {string=} opt_type Тип кодирования данных.
 * @return {!Array.<!sm.IEntity>} Массив сущностей.
 */
sm.IEntitySerializer.prototype.reconstructEntities =
    function(data, opt_type) {};
