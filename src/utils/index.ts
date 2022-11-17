import crypto from 'crypto';

export const getHash: (message: string) => string = (message: string) => {
    const hash = crypto
        .createHmac('sha256', Buffer.from("SECRET", 'hex'))
        .update(message)
        .digest('hex')
    return hash.slice(0, 24)
};
