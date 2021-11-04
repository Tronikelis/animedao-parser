export const stringBetween = (template: string, start: string, end: string) => {
    const strings = [] as string[];
    for (let i = 0; i < template.length; i++) {
        const curr = template.substring(i, i + start.length);
        
        if (curr === start) {
            const started = template.slice(i);
            const idx = started.indexOf(end);
            const between = started.slice(start.length, idx);
            strings.push(between);
        }
    }
    return strings;
}