export const messages = {
	en: {
		message: {
			hello: 'hello world',
		},
		header: {
			home: 'Home',
			course: 'Course',
		},
		auth: {
			username: 'Username',
			password: 'Password',
			register: 'Register',
			login: 'Login',
			toRegister: 'Go to @:auth.register',
			toLogin: 'Go to @:auth.login',
			logout: 'Logout',
			errors: {
				length: 'Length should be {0} to {1}',
				required: 'Please input {0}',
				existUsername: 'The username has existed.',
				invalidPassword:
					'Should be 12 to 24 long and contain at least one of !@#$%^&*, one number',
				fail: '{0} failed.',
			},
		},
		home: {
			title: 'Review Courses',
		},
		courses: {
			title: 'All Courses',
			inProgress: 'In Progress',
			done: 'Done',
			archived: 'Archived',
		},
		addButton: {
			create: 'Create',
			course: {
				create: 'Create Course',
			},
			progress: {
				create: 'Create Progress',
			},
		},
		components: {
			course: {
				courseCard: {
					markDone: 'Mark as Done',
					markInProgress: 'Mark as In Progress',
					markArchived: 'Archive',
					markUnarchived: 'Unarchive',
					delete: 'Delete',
				},
			},
		},
	},
	'zh-Hans': {
		message: {
			hello: '你好，世界',
		},
		header: {
			home: '主页',
			course: '课程',
		},
		auth: {
			username: '用户名',
			password: '密码',
			register: '注册',
			login: '登录',
			toRegister: '去@:auth.register',
			toLogin: '去@:auth.login',
			logout: '退出',
			errors: {
				length: '长度应在{0}至{1}之间',
				required: '请输入{0}',
				existUsername: '用户名已存在',
				invalidPassword:
					'长度应在{0}至{1}之间, 并至少包含!@#$%^&*的其中一个和一个数字',
				fail: '{0}失败',
			},
		},
		home: {
			title: '待复习课程',
		},
		courses: {
			title: '所有课程',
			inProgress: '进行中',
			done: '已完成',
			archived: '已归档',
		},
		addButton: {
			create: '创建',
			course: {
				create: '创建课程',
			},
			progress: {
				create: '创建进度',
			},
		},
		components: {
			course: {
				courseCard: {
					markDone: '标记为完成',
					markInProgress: '标记为进行中',
					markArchived: '归档',
					markUnarchived: '撤销归档',
					delete: '删除',
				},
			},
		},
	},
}
