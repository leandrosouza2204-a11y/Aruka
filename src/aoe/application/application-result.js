export const ok = (value, metadata = {}) => ({ ok: true, value, error: null, metadata });
export const fail = (error, metadata = {}) => ({ ok: false, value: null, error, metadata });
