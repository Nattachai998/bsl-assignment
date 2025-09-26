import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { space } from "postcss/lib/list";

export async function POST(req: Request) {
    const { type, payload } = await req.json();
    const supabase = await createClient();

    if(type === "createDepartment"){

        console.log("Data From Clinet", payload);
        
        try {
            const _data = await supabase
                .from("department")
                .insert([
                    {
                        department_name: payload.department_name,
                        title: payload.title
                    }
                ])
                .select()
                .single()

                console.log("create department success!")
                return NextResponse.json({ status: true, data: _data});
        } catch (error) {
            console.error("ERROR insert department:", error);
            return NextResponse.json(
                { error: "Cannot insert department to DB"},
                { status: 500 }
            )
        }
    }   

    if(type === "FetchDepartment"){
        console.log("Data From Clinet", payload);

        try{
            const _data = await supabase
                .from("department")
                .select(`department_id
                        ,department_name
                        ,title
                `)

            console.log("fetch department success!");
            return NextResponse.json({ status: true, data: _data.data })
        }catch(e){
            console.error("ERROR fetch department:", e);
            return NextResponse.json(
                { error: "Cannot GET department from DB"},
                { status: 500 }
            )
        }
    }
}