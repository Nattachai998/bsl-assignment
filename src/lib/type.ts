export interface Employee {
    employee_id: string
    employee_no: string
    employee_name: string
    employee_surname: string
    address: string
    phone: string
    create_date: Date
    update_date: Date
    delete_flag: boolean
    department_name: string
    department_id: string
    email: string
}

export interface Department {
    department_id: string
    department_name: string
    title: string
}