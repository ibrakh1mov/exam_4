import model from '../../utils/postgres.js'
const fetch = model.fetch
const fetchAll = model.fetchAll

const ADD_ORDER = `
	INSERT INTO orders(user_id, product_id) VALUES ($1, $2)
	RETURNING *
`
const CHANGE_ORDER = `
	UPDATE orders o SET
		product_id = (
			CASE WHEN $2 > 0 THEN $2 ELSE o.product_id END
		)
	WHERE user_id = $1 and order_id = $3 and ispaid = false
	RETURNING *
`
const DELETE_ORDER = `
	DELETE FROM orders WHERE order_id = $1 and user_id = $2 and ispaid = false
	RETURNING *
`
const ORDERS = `
	SELECT 
		o.*, 
		p.product_name, 
		count(o.product_id),
		p.product_price
	FROM orders o 
	LEFT JOIN products p ON o.product_id = p.product_id 
	LEFT JOIN users u ON o.user_id = u.user_id 
	WHERE
	CASE
		WHEN $5 > 0 THEN u.user_id = $5
		ELSE TRUE
	END AND
	CASE
		WHEN $3 = 'users' THEN (
			o.user_id = $4 and o.ispaid = false
		) ELSE TRUE
	END
	GROUP BY o.order_id, p.product_name, p.product_id
	offset $1 limit $2
`

const PAY = `
	UPDATE orders o SET
		ispaid = true
	WHERE user_id = $1 and ispaid = false
	RETURNING *
`

function orders ({ pagination: { page, limit }, role, userId, userId2 }) {
	return fetchAll(ORDERS, (page - 1) * limit, limit, role, userId2, userId )
}

function addOrder ({ userId, productId }) {
	return fetchAll(ADD_ORDER, userId, productId )
}

function changeOrder ({userId, productId, orderId}) {
	return fetchAll(CHANGE_ORDER, userId, productId, orderId)
}

function deleteOrder ({orderId, userId}) {
	return fetchAll(DELETE_ORDER, orderId, userId)
}

function pay ({userId}) {
	return fetchAll(PAY, userId)
}

export default {
	orders,
	addOrder,
	changeOrder,
	deleteOrder,
	pay
}