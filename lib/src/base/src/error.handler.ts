export type ErrorHandler = ( options: {
    scope?: string;
    head: string;
    body?: string;
    stacktrace?: string;
} ) => void