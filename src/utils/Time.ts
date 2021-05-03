export function sleep(ms = 0): Promise<void> {
    return new Promise(r => {
        if(ms <= 0) {
            r();
        } else {
            global.setTimeout(r, ms)
        }
    });
}