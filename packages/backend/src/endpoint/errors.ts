export const errors = [
	{
		_id: -1,
		code: 500,
		message: 'Server Error.'
	},
	{
		_id: 0,
		code: 404,
		message: 'Course Not Found'
	},
	{
		_id: 1,
		code: 404,
		message: 'Progress Not Found'
	},
	{
		_id: 2,
		code: 400,
		message: 'Invalid'
	},
	{
		_id: 3,
		code: 401,
		message: 'unauthorized'
	},
	{
		_id: 4,
		code: 404,
		message: 'User Not Found'
	}
]

export function findError(_id: number) {
	return errors.find((e) => e._id === _id) ?? errors[0]
}
