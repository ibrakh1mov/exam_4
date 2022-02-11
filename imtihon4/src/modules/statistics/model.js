import model from '../../utils/postgres.js'
const fetchAll = model.fetchAll

const TOTALMONEY_PAID = `
    SELECT 
        sum(p.product_price) as totalMoney
	FROM orders o 
	LEFT JOIN products p ON o.product_id = p.product_id 
	WHERE o.ispaid = true
`

const TOTALMONEY_UNPAID = `
    SELECT
        sum(p.product_price) as totalMoney
	FROM orders o 
	LEFT JOIN products p ON o.product_id = p.product_id 
	WHERE o.ispaid = false
`

function totalMoney_paid () {
    return fetchAll(TOTALMONEY_PAID)
}

function totalMoney_unpaid () {
    return fetchAll(TOTALMONEY_UNPAID)
}

export default {
	totalMoney_paid,
    totalMoney_unpaid
}