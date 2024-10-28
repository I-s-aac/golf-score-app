export function sanitizeInput(str) {
    return str.replace(/[^a-zA-Z0-9 .,]/g, '');
}

export async function dataFromUrl(url) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json(); // data

    } catch (error) {
        console.error("Fetch error: ", error);
        // Fallback or default behavior, depending on your needs:
        return null; // or some default data
    }
}