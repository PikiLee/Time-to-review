export const messages = {
	en: {
		message: {
			hello: 'hello world'
		},
		auth: {
			username: 'username',
			password: 'password',
			register: 'register',
			errors: {
				length: 'Length should be {0} to {1}',
				required: 'Please input {0}',
				existUsername: 'The username has existed.',
				invalidPassword: 'Should be 12 to 24 long and contain at least one of !@#$%^&*, one number',
				fail: '{0} failed.'
			}
		}
	},
	'zh-Hans': {
		message: {
			hello: '你好，世界'
		},
		auth: {
			username: '用户名',
			password: '密码',
			register: '注册',
			errors: {
				length: '长度应在{0}至{1}之间',
				required: '请输入{0}',
				existUsername: '用户名已存在',
				invalidPassword: '长度应在{0}至{1}之间, 并至少包含!@#$%^&*的其中一个和一个数字',
				fail: '{0}失败'
			}
		}
	}
}