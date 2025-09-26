import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
    const { type, payload } = await req.json();
    const supabase = await createClient();

    console.log("PAYLOAD : ", payload);

    if(type === "FetchEmployee") {
        try{
            const _data = await supabase
                .from("employee")
                .select(`employee_id
                        ,employee_no
                        ,employee_name 
                        ,employee_surname
                        ,address
                        ,phone
                        ,email
                        ,create_date
                        ,update_date
                        ,delete_flag
                        ,department_id
                        ,department_name
                `)

            console.log("fetch employee success!");
            return NextResponse.json({ status: true, data: _data.data })
        }catch(e){
            console.error("ERROR fetch products:", e);
            return NextResponse.json(
                { error: "Cannot GET product from DB"},
                { status: 500 }
            )
        }
    }

    if(type === "createEmployee"){
        
        try {
            const _data = await supabase
                .from("employee")
                .insert([
                    {
                        employee_no: payload.employee_no,
                        employee_name: payload.employee_name,
                        employee_surname: payload.employee_surname,
                        email: payload.email,
                        phone: payload.phone,
                        address: payload.address,
                        department_id: payload.department_id,
                        department_name: payload.department_name,
                        create_date: payload.create_date,
                        update_date: payload.update_date,
                        delete_flag: payload.delete_flag
                    }
                ])
                .select()
                .single()

                console.log("created employee success!");
                return NextResponse.json({ status: true, data: _data })
        } catch (error) {
            console.error("ERROR insert products:", error);
            return NextResponse.json(
                { error: "Cannot insert product to DB"},
                { status: 500 }
            )
        }
    }

    if(type === "updateEmployee"){

        try{
            const _data = await supabase
                .from("employee")
                .update({
                    employee_no: payload.employee_no,
                    employee_name: payload.employee_name,
                    employee_surname: payload.employee_surname,
                    email: payload.email,
                    phone: payload.phone,
                    address: payload.address,
                    department_id: payload.department_id,
                    department_name: payload.department_name,
                    create_date: payload.create_date,
                    update_date: payload.update_date,
                    delete_flag: payload.delete_flag
                })
                .eq("employee_id", payload.employee_id)
                .select()
                .single();

                console.log("update employee success!");
                return NextResponse.json({ status: true, data: _data })
        }catch(e){
            console.error("ERROR insert employee:", e);
            return NextResponse.json(
                { error: "Cannot update employee to DB"},
                { status: 500 }
            )
        }
    }

    if(type === "deleteEmployee"){

        try{

            const _data = await supabase
                .from("employee")
                .delete()
                .eq("employee_id", payload.employee_id)

                console.log("delete employee success!");
                return NextResponse.json({ status: true, data: _data })
        }catch(e){
            console.error("ERROR insert employee:", e);
            return NextResponse.json(
                { error: "Cannot delete employee to DB"},
                { status: 500 }
            )
        }
    }

    if(type === "getEmployee"){

        console.log(payload)
        try {
            const _data = await supabase
                .from("employee")
                .select('*')
                .eq("employee_id", payload)
                .single()

            console.log("Get employee success!");
            return NextResponse.json({ status: true, data: _data.data })
        } catch (error) {
            console.error("ERROR get employee:", error);
            return NextResponse.json(
                { error: "Cannot get employee to DB"},
                { status: 500 }
            )
        }
    }
}