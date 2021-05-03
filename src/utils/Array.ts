/**
 * Return [ 0, 1, 2 ] from 3
 */
export function range(n: number) {
    const r = new Array<number>();
    for(let i = 0; i < n; i++) {
        r.push(i);
    }
    return r;
}