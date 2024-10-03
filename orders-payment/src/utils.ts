import { randomUUID } from 'crypto';

export const sleep = (time: number = 1000): Promise<void> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, time);
    })
}

export const genereteUUISimple = (): string => {
    const uuid: string = randomUUID()
    const uuidToken = uuid.split('-')
    return uuidToken[uuidToken.length - 1]
}
