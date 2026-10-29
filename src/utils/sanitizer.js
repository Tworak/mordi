export function sanitizeText(text) {
    if (!text) return '';
    return text.replace(/[\uF0-\uFFFF]/g, '');
}

