import { describe, expect, it } from 'vitest'
import { SailingBoat } from './SailingBoat'
import { FirebaseWrapper } from '../../../shared/classes/FirebaseWrapper'

const store = new FirebaseWrapper()

const boat = new SailingBoat({
    boatId: 'abc',
    teamId: 'xyz',
    boatSpeed: 9,
    cargoLevel: 3,
    availableFish: ['torsk', 'markrel', 'rødspætte'],
    store,
    destinationAreaNumber: 1,
    startTime: 1000,
})

describe('SailingBoat', () => {

    describe('catchFish', () => {
        it('should max catch all fish if amount available is greater than cargo size', () => {
            const input = [
                { name: 'torsk', amountAvailable: 100, },
                { name: 'markrel', amountAvailable: 100, },
                { name: 'rødspætte', amountAvailable: 100, },
            ]
            const expected = [
                { name: 'torsk', amount: 50 },
                { name: 'markrel', amount: 50 },
                { name: 'rødspætte', amount: 50 }
            ]
            const actual = boat.catchFish(input)
            expect(actual).toStrictEqual(expected)
        })


        it('should not return anything if all fish are zero', () => {
            const input = [
                { name: 'torsk', amountAvailable: 0, },
                { name: 'markrel', amountAvailable: 0, },
                { name: 'rødspætte', amountAvailable: 0, },
            ]
            const expected = [
                { name: 'torsk', amount: 0 },
                { name: 'markrel', amount: 0 },
                { name: 'rødspætte', amount: 0 }
            ]
            const actual = boat.catchFish(input)
            expect(actual).toStrictEqual(expected)
        })

        it('should fill cargo with available fish', () => {
            const input = [
                { name: 'torsk', amountAvailable: 30, },
                { name: 'markrel', amountAvailable: 300, },
                { name: 'rødspætte', amountAvailable: 300, },
            ]
            const expected = [
                { name: 'torsk', amount: 30 },
                { name: 'markrel', amount: 50 },
                { name: 'rødspætte', amount: 50 },
                { name: 'markrel', amount: 10 },
                { name: 'rødspætte', amount: 10 }
            ]
            const actual = boat.catchFish(input)
            expect(actual).toStrictEqual(expected)
        })

        it('should fill cargo with available fish, fish not not full', () => {
            const input = [
                { name: 'torsk', amountAvailable: 30, },
                { name: 'markrel', amountAvailable: 55, },
                { name: 'rødspætte', amountAvailable: 300, },
            ]
            const expected = [
                { name: 'torsk', amount: 30 },
                { name: 'markrel', amount: 50 },
                { name: 'rødspætte', amount: 50 },
                { name: 'markrel', amount: 5 },
                { name: 'rødspætte', amount: 10},
                { name: 'rødspætte', amount: 5}
            ]
            const actual = boat.catchFish(input)
            expect(actual).toStrictEqual(expected)
        })

        it('Should take all available fish if cargo cannot be filled', () => {
            const input = [
                { name: 'torsk', amountAvailable: 30, },
                { name: 'markrel', amountAvailable: 55, },
                { name: 'rødspætte', amountAvailable: 50, },
            ]
            const expected = [
                { name: 'torsk', amount: 30 },
                { name: 'markrel', amount: 50 },
                { name: 'rødspætte', amount: 50 },
                { name: 'markrel', amount: 5 },
            ]
            const actual = boat.catchFish(input)
            expect(actual).toStrictEqual(expected)
        })
    })
})
