import model from '../../utils/postgres.js'
const fetch = model.fetch
const fetchAll = model.fetchAll

const CATEGORIES = `
	SELECT
		*
	FROM categories
	WHERE
	CASE
		WHEN $1 > 0 THEN category_id = $1
		ELSE TRUE
	END AND
	CASE
		WHEN LENGTH($2) > 0 THEN (
			category_name ILIKE CONCAT('%', $2, '%')
		) ELSE TRUE
	END
	ORDER BY category_id
	offset $3 limit $4
`
const ADD_CATEGORY = `
	INSERT INTO categories(category_name) VALUES ($1)
	RETURNING *
`
const CHANGE_CATEGORY = `
	UPDATE categories c SET
		category_name = (
			CASE WHEN LENGTH($2) > 0 THEN $2 ELSE c.category_name END
		)
	WHERE category_id = $1
	RETURNING *
`
const DELETE_CATEGORY = `
	DELETE FROM categories WHERE category_id = $1
	RETURNING *
`

function categories ({ pagination: { page, limit }, categoryId, search, }) {
	return fetchAll(CATEGORIES, categoryId, search, (page - 1) * limit, limit)
}

function addCategory ({categoryName}) {
	return fetchAll(ADD_CATEGORY, categoryName)
}

function changeCategory ({categoryId, categoryName}) {
	return fetchAll(CHANGE_CATEGORY, categoryId, categoryName)
}

function deleteCategory ({categoryId}) {
	return fetchAll(DELETE_CATEGORY, categoryId)
}

export default {
	categories, 
	addCategory,
	changeCategory,
	deleteCategory,
}