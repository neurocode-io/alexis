export const runSafely = async (callback: () => Promise<unknown>) => {
    try {
        return await callback();
    } catch (err) {
        throw new Error(err);
    }
}