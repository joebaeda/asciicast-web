/**
 * Utility library for working with UTC date and time
 */

const utcDateTime = {
    /**
     * Get the current UTC date in YYYY-MM-DD format
     * @returns {string} - Formatted date
     */
    getUTCDate: (): string => {
        const timestamp = new Date();
        const day = String(timestamp.getUTCDate()).padStart(2, '0');
        const month = String(timestamp.getUTCMonth() + 1).padStart(2, '0');
        const year = timestamp.getUTCFullYear();
        return `${year}-${month}-${day}`;
    },

    /**
     * Get the current UTC time in HH:MM:SS format
     * @returns {string} - Formatted time
     */
    getUTCTime: (): string => {
        const timestamp = new Date();
        const hours = String(timestamp.getUTCHours()).padStart(2, '0');
        const minutes = String(timestamp.getUTCMinutes()).padStart(2, '0');
        const seconds = String(timestamp.getUTCSeconds()).padStart(2, '0');
        return `${hours}-${minutes}-${seconds}`;
    },

    /**
     * Get the current UTC date and time in YYYY-MM-DD HH:MM:SS format
     * @returns {string} - Formatted date and time
     */
    getUTCDateTime: (): string => {
        const date = utcDateTime.getUTCDate();
        const time = utcDateTime.getUTCTime();
        return `${date}-${time}`;
    },
};

export default utcDateTime;
