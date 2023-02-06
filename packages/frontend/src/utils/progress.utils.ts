export function getStageString(stage: number, numIntervals: number) {
	if (stage === 0) {
		return 'Learned'
	} else if (stage === numIntervals + 1) {
		return 'Done'
	} else {
		return `Reviewed ${stage} Times`
	}
}