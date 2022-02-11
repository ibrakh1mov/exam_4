import model from '../../utils/postgres.js'
const fetchAll = model.fetchAll

const REGISTER = `
	INSERT INTO users(username, contact, email, password, role) VALUES ($1, $2, $3, crypt($4, gen_salt('bf')), $5)
`

const FIND_USER = `
	SELECT 
		u.user_id,
		u.username,
		u.contact,
		u.email,
		u.role
	FROM users u WHERE password = crypt($2,password) AND username = $1;
`

function register ({ username, contact, email, password }) {
	const role = 'users'
	return fetchAll(REGISTER, username, contact, email, password, role)
}

function findUser ({ username, password }) {
	return fetchAll(FIND_USER, username, password)
}

export default {
	register,
	findUser,
}