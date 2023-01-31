import { app } from './app.js'

export function startApp(port: number) {
	app.listen(port, () => {
		console.log(`Example app listening on port ${port}`)
	})
}

startApp(3000)