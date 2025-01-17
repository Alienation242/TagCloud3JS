const originalTags = [
    { name: 'a', size: 8 },
    { name: 'acat', size: 11 },
    { name: 'ada', size: 5 },
    { name: 'bhc', size: 15 },
    { name: 'fabs', size: 3 },
    { name: 'faust', size: 4 },
    { name: 'fr', size: 17 },
    { name: 'fussball', size: 7 },
    { name: 'gym', size: 3 },
    { name: 'hand', size: 44 },
    { name: 'heike', size: 4 },
    { name: 'hmir', size: 5 },
    { name: 'kommunismus', size: 3 },
    { name: 'maske', size: 6 },
    { name: 'nazis', size: 3 },
    { name: 'neo', size: 3 },
    { name: 'polizei', size: 8 },
    { name: 'portrait', size: 10 },
    { name: 'pr', size: 8 },
    { name: 'quaumr', size: 5 },
    { name: 'schefff', size: 3 },
    { name: 'skg', size: 5 },
    { name: 'smiley', size: 11 },
    { name: 'stern', size: 9 },
    { name: 'timoschinsky', size: 4 },
    { name: 'toy', size: 6 },
    { name: 'vulva', size: 7 }
];

const minSize = Math.min(...originalTags.map(tag => tag.size));
const maxSize = Math.max(...originalTags.map(tag => tag.size));

// Parameters to control the scaling range
const minScale = 1.5;  // Smallest picture scale
const maxScale = 8;  // Largest picture scale

const normalizedTags = originalTags
    .map(tag => {
        const normalizedSize = minScale + ((tag.size - minSize) / (maxSize - minSize)) * (maxScale - minScale);
        return { url: `img/${tag.name}.png`, size: normalizedSize, originalSize: tag.size };
    });

export const tags = normalizedTags.sort((a, b) => a.url.localeCompare(b.url));
