import { ElMessage } from "element-plus";

export function errorMsg(msg: string) {
	ElMessage({
		message: msg,
		type: "error",
	});
}

export function successMsg(msg: string) {
	ElMessage({
		message: msg,
		type: "success",
	});
}
