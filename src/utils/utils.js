export function range(start, stop, count) {
    const step = (stop - start) / count;
    return Array.from({ length: (stop - start) / step + 1}, (_, i) => start + (i * step));
}  