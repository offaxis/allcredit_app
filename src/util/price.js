export function getPriceCent(price) {
    return Math.round(parseFloat(price) * 100);
}

export function getPriceFromCent(priceInCents) {
    return Math.round(priceInCents) / 100;
}
