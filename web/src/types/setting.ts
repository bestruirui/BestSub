
export interface Setting {
    key: string
    value: string
}

export type FormValue = string | number | boolean | string[]

export interface FormValues {
    [key: string]: FormValue
}
