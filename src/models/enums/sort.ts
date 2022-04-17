export enum Sort {
    ASC = 'asc',
    DESC = 'desc',
    ALPHA = 'alpha',
    PLY_DESC = 'play_desc',
    DOW_DESC = 'dow_desc'
};
export const SortValues = Object.keys(Sort).map((k: any) => Sort[k]);
