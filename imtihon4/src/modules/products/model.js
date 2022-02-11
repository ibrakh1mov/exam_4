import model from '../../utils/postgres.js'
const fetchAll = model.fetchAll

const USERS = `
	SELECT
		user_id,
		username,
		contact,
		email,
		role
	FROM users
	WHERE
	CASE
		WHEN $1 > 0 THEN user_id = $1
		ELSE TRUE
	END AND
	CASE
		WHEN LENGTH($2) > 0 THEN (
			username ILIKE CONCAT('%', $2, '%') OR
			full_name ILIKE CONCAT('%', $2, '%')
		) ELSE TRUE
	END AND
	CASE
		WHEN $3 IN (true, false) THEN active = $3
		ELSE TRUE
	END
	ORDER BY user_id
	offset $4 limit $5
`

const PRODUCTS = `
	SELECT
		*
	FROM products
	WHERE
	CASE
		WHEN $5 > 0 THEN category_id = $5
		ELSE TRUE
	END AND
	CASE
		WHEN $1 > 0 THEN product_id = $1
		ELSE TRUE
	END AND
	CASE
		WHEN LENGTH($2) > 0 THEN (
			product_name ILIKE CONCAT('%', $2, '%')
		) ELSE TRUE
	END
	ORDER BY product_id
	offset $3 limit $4
`

const ADD_PRODUCT = `
	INSERT INTO products(category_id, product_name, product_price, short_info, long_info, file_path) VALUES ($1, $2, $3, $4, $5, $6)
	RETURNING *
`

const CHANGE_PRODUCT = `
	UPDATE products p SET
		category_id = (
			CASE WHEN $2 > 0 THEN $2 ELSE p.category_id END
		),
		product_name = (
			CASE WHEN LENGTH($3) > 0 THEN $3 ELSE p.product_name END
		),
		product_price = (
			CASE WHEN $4 > 0 THEN $3 ELSE p.product_price END
		),
		short_info = (
			CASE WHEN LENGTH($5) > 0 THEN $5 ELSE p.short_info END
		),
		long_info = (
			CASE WHEN LENGTH($6) > 0 THEN $6 ELSE p.long_info END
		)
	WHERE product_id = $1
	RETURNING *
`

const DELETE_PRODUCT = `
	DELETE FROM products WHERE product_id = $1
	RETURNING *
`


function users ({ pagination: { page, limit }, search, userId, active }) {
	return fetchAll(USERS, userId, search, active, (page - 1) * limit, limit)
}

function products ({ pagination: { page, limit }, productId, categoryId, search, }) {
	return fetchAll(PRODUCTS, productId, search, (page - 1) * limit, limit, categoryId)
}

function addProduct ({productName, categoryId, productPrice, short_info, long_info, file_path}) {
	return fetchAll(ADD_PRODUCT, categoryId, productName, productPrice, short_info, long_info, file_path)
}

function changeProduct ({productId, categoryId,productName, productPrice, short_info, long_info }) {
	return fetchAll(CHANGE_PRODUCT, productId, categoryId, productName, productPrice, short_info, long_info )
}

function deleteProduct ({productId}) {
	return fetchAll(DELETE_PRODUCT, productId)
}


export default {
	users,
	products,
	addProduct,
	changeProduct,
	deleteProduct
}