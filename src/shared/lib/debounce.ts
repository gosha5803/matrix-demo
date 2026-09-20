export const debounce = <P, R>(
    cb: (params: P) => R,
    delay: number
) => {
    let timer: number

    return (args: P) => {
        if (timer) {
            clearTimeout(timer)
        }

        timer = setTimeout(() => cb(args), delay)
    }
}
