export function sequence(items, consumer) {
    const results = [];
    const runner = () => {
        const item = items.shift();
        if(item) {
            return consumer(typeof item === 'function' ? item() : item)
            .then((result) => {
                results.push(result);
            })
            .then(runner);
        }

        return Promise.resolve(results);
    };

    return runner();
}

export function sleep(milliseconds) {
    const start = new Date().getTime();
    for(let i = 0; i < 1e7; i++) {
        if((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}
