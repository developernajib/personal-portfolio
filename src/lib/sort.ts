// Manual display ordering. Items with a lower `order` value appear first.
// Items without an `order` keep their file position after all ordered items.
export function sortByOrder<T extends { order?: number }>(items: T[]): T[] {
	return [...items]
		.map((item, index) => ({ item, index }))
		.sort((a, b) => {
			const ao = a.item.order ?? Number.MAX_SAFE_INTEGER
			const bo = b.item.order ?? Number.MAX_SAFE_INTEGER
			if (ao !== bo) return ao - bo
			return a.index - b.index
		})
		.map((entry) => entry.item)
}
