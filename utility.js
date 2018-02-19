import RandomString from 'randomstring';

const CSS_CLASS_SEPARATOR = ' ';

/**
 * Creates className from attributes joined with class separator.
 * @param classes Array
 * @param separator string
 * @return string
 */
export function createClassName(...classes) {
    return classes.filter(item => item).join(CSS_CLASS_SEPARATOR);
}

export function clamp(number, lowerBound, upperBound) {
    number = Math.min(number, upperBound);
    number = Math.max(number, lowerBound);
    return number;
}

export function omit(object, key) {
    const result = Object.assign({}, object)
    if (Array.isArray(key)) {
        key.forEach(item => {
            delete result[item]
        });
    } else {
        delete result[key]
    }
    return result
}

export const without = (array, index) => index < 0 ? array : [
    ...array.slice(0, index),
    ...array.slice(index + 1),
]

export const generateRandomKeys = (count, exceptions = []) => {
    const keys = []
    while (count) {
        const randomKey = RandomString.generate(6)
        if (exceptions.includes(randomKey)) {
            continue
        }
        keys.push(randomKey)
        --count
    }
    if (keys.length === 1) {
        return keys[0]
    }
    return keys
}

export const todoOccurrenceCount = (lists, todoId) => Object.keys(lists)
    .map(key => lists[key].todoIds.includes(todoId))
    .reduce((sum, value) => sum + value, 0)