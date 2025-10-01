export const pageSizeOptions = [1, 5, 10, 20, 50, 100] as const;
export type PageSizeOption = (typeof pageSizeOptions)[number];
