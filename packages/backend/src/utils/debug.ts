import { IS_DEV } from '../app.js'

export function printDebugInfo(req: any) {
	if (IS_DEV)
		console.debug({
			'req.route': req.route,
			'req.method': req.method,
			'req.originalUrl': req.originalUrl,
			'req.body': req.body,
			'req.params': req.params
		})
}
