import { ElMessage } from "element-plus";

export function errorMsg(msg: string) {
	ElMessage({
		message: msg,
		type: "error",
	});
}
