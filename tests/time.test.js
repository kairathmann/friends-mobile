import moment from 'moment'
import { getRoundBounds } from '../src/common/time'

it('Returns 01.03 and 08.03 for 5sth March ', () => {
	const [from, to] = getRoundBounds(moment('2019-03-05'))
	expect(from.date()).toBe(1)
	expect(from.month()).toBe(2)
	expect(to.date()).toBe(8)
	expect(to.month()).toBe(2)
	expect(to.year()).toBe(from.year())
})

it('Returns 19.03 and 26.03 for 21st March ', () => {
	const [from, to] = getRoundBounds(moment('2019-04-21'))
	expect(from.date()).toBe(19)
	expect(from.month()).toBe(3)
	expect(to.date()).toBe(26)
	expect(to.month()).toBe(3)
	expect(to.year()).toBe(from.year())
})

it('Returns 28.12.18 and 04.01.19 for 31st December 2018 ', () => {
	const [from, to] = getRoundBounds(moment('2018-12-31'))
	expect(from.date()).toBe(28)
	expect(from.month()).toBe(11)
	expect(from.year()).toBe(2018)
	expect(to.date()).toBe(4)
	expect(to.month()).toBe(0)
	expect(to.year()).toBe(2019)
})

it('Returns 27.09 and 04.10 for 30th September ', () => {
	const [from, to] = getRoundBounds(moment('2019-09-30'))
	expect(from.date()).toBe(27)
	expect(from.month()).toBe(8)
	expect(to.date()).toBe(4)
	expect(to.month()).toBe(9)
	expect(to.year()).toBe(from.year())
})
