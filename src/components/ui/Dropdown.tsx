"use client";
import { useEffect, useState } from "react";
import { Department } from "@/lib/type";
 
type param = {
    val: string;
    chage: (o: Department | null) => void
}

export function DepartmentSelected({val, chage}: param ) {

    console.log("Department DropDown Function")
    const [items, setItems] = useState<any[]>([]);

    useEffect(() => {
        
        const loadDepartment = async() => {
            try{
                const res = await fetch("/api/department", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ type: "FetchDepartment", payload: {} }),
                });
                
                if(!res.ok) throw new Error("Loadding Department Failed");
                const data = await res.json();
                setItems(data.data);
            }catch(e){
                console.log("Error",e)
            }
        }

        loadDepartment();
    }, [])

    return(
        <select
            // className="text-gray-900 mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 
            //             focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500
            //         "
            className="mt-1 w-full text-gray-900 rounded-lg border border-indigo-300 focus:outline-none px-3 py-2 hover:border-indigo-400"
            value={val}
            onChange={(e) => {
                const itemData = e.target.value;
                const findData = items.find((item) => item.department_id === itemData)
                chage(findData);
            }}
        >
            <option value="" disabled>
                Select Department
            </option>
            {items.map((d) => (
                <option key={d.department_id} value={d.department_id}>
                    {d.department_name}
                </option>
            ))}
        </select>
    )
}

