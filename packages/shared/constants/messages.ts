export const messages = {
	en: {
		message: {
			hello: 'hello world',
			created: '{0} has been created.',
			updated: '{0} has been updated.',
			deleted: '{0} has been deleted.',
			fail: 'Action failed.'
		},
		actions: {
			confirm: 'Confirm',
			delete: 'Delete',
			create: 'Create',
			cancel: 'Cancel',
			edit: 'Edit',
			placeholder: 'Input Something...'
		},
		course: {
			name: 'course',
			cap: '@.capitalize:course.name',
			create: '@:actions.create @:course.cap',
			setting: '@:course.cap Settings',
			edit: '@:actions.edit @:course.cap',
			stage: 'Stage',
			lastReviewDate: 'Last Review Date',
			nextReviewDate: 'Next Review Date',
			nextStage: 'Update to Next Stage'
		},
		progress: {
			name: 'progress',
			cap: '@.capitalize:progress.name',
			create: '@:actions.create @:progress.cap',
			update: '@:actions.update @:progress.cap'
		},
		common: {
			empty: 'Nothing here.',
			course: 'course',
			progress: 'progress',
			Course: '@capitalize.common.course',
			Pourse: '@capitalize.common.progress'
		},
		errors: {
			required: 'Please input a value.',
			length: 'Length should be {0} to {1}'
		},
		stages: {
			learned: 'Learned',
			done: 'Done',
			review: 'Reviewed {count} Time | Reviewed {count} Times'
		},
		header: {
			home: 'Home',
			course: 'Course'
		},
		auth: {
			username: 'Username',
			password: 'Password',
			register: 'Register',
			login: 'Login',
			toRegister: 'Go to @:auth.register',
			toLogin: 'Go to @:auth.login',
			logout: 'Logout',
			success: '{0} succeeded.',
			errors: {
				length: 'Length should be {0} to {1}',
				required: 'Please input {0}',
				existUsername: 'The username has existed.',
				invalidPassword:
					"Should be 12 to 24 long and contain at least one of !{'@'}#{'$'}%^&*, one number",
				fail: '{0} failed.'
			}
		}
	},
	'zh-Hans': {
		message: {
			hello: '你好，世界'
		},
		actions: {
			confirm: '确认',
			delete: '删除',
			create: '创建',
			cancel: '取消',
			edit: '编辑',
			placeholder: '输入点什么吧...'
		},
		course: {
			name: '课程',
			cap: '@.capitalize:course.name',
			create: '@:actions.create@:course.cap',
			edit: '@:actions.edit@:course.cap',
			setting: '课程设置',
			stage: '阶段',
			lastReviewDate: '上次复习时间',
			nextReviewDate: '下次复习时间',
			nextStage: '修改为下一阶段'
		},
		progress: {
			name: '进度',
			cap: '@.capitalize:progress.name',
			create: '@:actions.create@:progress.cap',
			update: '@:actions.update@:progress.cap'
		},
		common: {
			empty: '这里什么也没有',
			course: '课程',
			progress: '进度'
		},

		errors: {
			required: '请输入一个值',
			length: '长度应在{0}至{1}之间'
		},
		stages: {
			learned: '已学习',
			done: '已完成',
			review: '已复习{count}次'
		},
		header: {
			home: '主页',
			course: '课程'
		},
		auth: {
			username: '用户名',
			password: '密码',
			register: '注册',
			login: '登录',
			toRegister: '去@:auth.register',
			toLogin: '去@:auth.login',
			logout: '退出',
			success: '{0} 成功.',
			errors: {
				length: '长度应在{0}至{1}之间',
				required: '请输入{0}',
				existUsername: '用户名已存在',
				invalidPassword:
					"长度应在{0}至{1}之间, 并至少包含!{'@'}#{'$'}%^&*的其中一个和一个数字",
				fail: '{0}失败'
			}
		}
	}
}
