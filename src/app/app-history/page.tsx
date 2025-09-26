"use client";

import { useEffect, useState } from "react";
import { Employee } from "@/lib/type";
import { useRouter } from "next/navigation";

import { DepartmentSelected } from "@/components/ui/Dropdown";
import {
  HomeIcon,
} from "@heroicons/react/24/outline";

export default function HistoryPage() {
  const router = useRouter();
  const Swal = require("sweetalert2");

  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState(null);
  const [items, setItems] = useState<any[]>([]);

  //Dialog Control Form
  const [form, setForm] = useState<Employee>({
    employee_id: "",
    employee_no: "EMP-",
    employee_name: "",
    employee_surname: "",
    address: "",
    phone: "",
    create_date: new Date(),
    update_date: new Date(),
    delete_flag: false,
    department_name: "",
    department_id: "",
    email: "",
  });

  //Table Control Form
  const onFetchEmplooye = async () => {
    const res = await fetch("/api/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "FetchEmployee", payload: {} }),
    });

    if (!res.ok) throw new Error("Data Error");
    const json = await res.json();
    const mapitem = json.data.map((e: any) => ({
      employee_id: e.employee_id,
      employee_no: e.employee_no,
      employee_name: e.employee_name,
      employee_surname: e.employee_surname,
      address: e.address,
      phone: e.phone,
      department_id: e.department_id,
      department_name: e.department_name,
      email: e.email,
      update_date: e.update_date,
    }));
    setItems(mapitem);
  }

  function onShow() {
    setEdit(null)
    setShow(true)
    setForm({
      employee_id: "",
      employee_no: "EMP-",
      employee_name: "",
      employee_surname: "",
      address: "",
      phone: "",
      create_date: new Date(),
      update_date: new Date(),
      delete_flag: false,
      department_name: "",
      department_id: "",
      email: "",
    })
  }

  const onAddEmployee = async () => {
    if ( !form.employee_name || !form.employee_surname || !form.department_id) {
      Swal.fire("Error", "กรอกข้อมูลให้ครบถ้วน", "error");
      return;
    }

    const isEdit = Boolean(edit);
    const type = isEdit ? "updateEmployee" : "createEmployee"
    const payload = isEdit ? { ...form, employee_id: edit } : form;
    
    Swal.fire({
      icon: "question",
      title: isEdit ? "Do you want to Update Data?" : "Do you want to Save Data?",
      text: "Please verify the information before saving.",
      showDenyButton: true,
      confirmButtonText: "Save",
    }).then((result: any) => {
      if (result.isConfirmed) {
        fetch("/api/history", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type, payload }),
        })
          .then((resData) => {
            if (!resData.ok) throw new Error("Data Error");

            resData.json().then(() => {
              Swal.fire("Saved!", "", "success");
              setForm({
                employee_id: "",
                employee_no: "EMP-",
                employee_name: "",
                employee_surname: "",
                address: "",
                phone: "",
                create_date: new Date(),
                update_date: new Date(),
                delete_flag: false,
                department_name: "",
                department_id: "",
                email: "",
              });
              setShow(false);
              setEdit(null);
              onFetchEmplooye();
            });
          })
          .catch((error) => {
            Swal.fire(
              {
                icon: "error",
                title: "Something went wrong!",
                text: "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
              },
              error
            );
          });
      }
    });
  };

  const onEditEmployee = async(row: any) => {
    setEdit(row.employee_id);
    setShow(true);
    console.log(row)
    setForm({
      employee_id: row.employee_id,
      employee_no: row.employee_no,
      employee_name: row.employee_name,
      employee_surname: row.employee_surname,
      address: row.address,
      phone: row.phone,
      create_date: row.create_date,
      update_date: row.update_date,
      delete_flag: false,
      department_name: row.department_name,
      department_id: row.department_id,
      email: row.email,
    })

  };

  const onDelete = async(row: any) => {
    Swal.fire({
      icon: "warning",
      title: `ลบพนักงาน ${row.employee_no}?`,
      showCancelButton: true,
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
    }).then(async (result: any) => {
      if (!result.isConfirmed) return;

      const res = await fetch("/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "deleteEmployee",
          payload: { employee_id: row.employee_id },
        }),
      });

      if (!res.ok) {
        Swal.fire({
          icon: "error",
          title: "ลบไม่สำเร็จ",
          text: "Delete failed",
        });
      }

      Swal.fire("Deleted!", "", "success").then(onFetchEmplooye);
    });
  }

  const onView = async(emp_id: string) => {
    router.push(`/app-profile?emp_id=${emp_id}`);
  }

  useEffect(() => {
    onFetchEmplooye();
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h1 className="flex items-center text-2xl font-semibold text-gray-800">
              {/* <HomeIcon className="h-10 w-10 text-slate-300" /> */}
              History
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              List of all employees in the HRM system (UI Prototype)
            </p>
          </div>
          <button
            onClick={onShow}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
          >
            + Add Employee
          </button>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full table-fixed">
            <thead className="bg-gray-50 text-left text-sm text-gray-600">
              <tr>
                <th className="w-30 px-4 py-3">No</th>
                <th className="w-30 px-4 py-3">Employee ID</th>
                <th className="w-30 px-4 py-3">First Name</th>
                <th className="w-30 px-4 py-3">Last Name</th>
                <th className="w-30 px-4 py-3">Department</th>
                <th className="w-30 px-4 py-3">Email</th>
                <th className="w-30 px-4 py-3">Hired</th>
                <th className="w-30 px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {items.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-10 text-center text-gray-500"
                  >
                    No employees found.
                  </td>
                </tr>
              ) : (
                items.map((e, index) => (
                  <tr key={e.employee_id} className="hover:bg-gray-50/60">
                    <td className="text-gray-900 px-4 py-3">
                      {index + 1}
                    </td>
                    <td className="text-gray-900 px-4 py-3">
                      {e.employee_no}
                    </td>
                    <td className="text-gray-900 truncate px-4 py-3">{e.employee_name}</td>
                    <td className="text-gray-900 truncate px-4 py-3">{e.employee_surname}</td>
                    <td className="text-gray-900 px-4 py-3">{e.department_name}</td>
                    <td className="text-gray-900 truncate px-4 py-3">{e.email}</td>
                    <td className="text-gray-900 px-4 py-3">{new Date(e.update_date).toLocaleDateString()}</td>
                    <td className="text-gray-900 px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button 
                          className="rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-700 hover:bg-gray-100"
                          onClick={() => onView(e.employee_id)}
                        >
                          View
                        </button>
                        <button 
                          className="rounded-md border bg-amber-300 px-2 py-1 text-xs text-white hover:bg-amber-400"
                          onClick={() => onEditEmployee(e)}
                        >
                          Edit
                        </button>
                        <button 
                          className="rounded-md border bg-red-400 px-2 py-1 text-xs text-white hover:bg-red-500"
                          onClick={() => onDelete(e)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center mt-4 text-sm text-gray-500">
          <span className="font-medium">----------- Showing {items.length} employees -----------</span> 
        </div>
      </div>

      {/* Dialog */}
      {show && (
        <div>
          <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
            <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
              <div className="flex items-center justify-between border-b px-3 py-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Add Employee
                </h3>
                <button
                  onClick={() => setShow(false)}
                  className="rounded-md p-1 text-gray-500 hover:bg-gray-100"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-4 px-3 py-3">
                <div>
                    <label className="font-medium text-sm text-gray-700">Employee No</label>
                    <input
                      className="mt-1 w-full text-gray-900 rounded-lg border border-indigo-300 focus:outline-none px-3 py-2 hover:border-indigo-400"
                      placeholder="Employee ID"
                      value={form.employee_no}
                      onChange={(e) =>
                        setForm({ ...form, employee_no: e.target.value })
                      }
                    />
                  </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-medium text-sm text-gray-700">First Name</label>
                    <input
                      className="mt-1 w-full text-gray-900 rounded-lg border border-indigo-300 focus:outline-none px-3 py-2 hover:border-indigo-400"
                      placeholder="Firstname"
                      value={form.employee_name}
                      onChange={(e) =>
                        setForm({ ...form, employee_name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="font-medium text-sm text-gray-700">Last Name</label>
                    <input
                      className="mt-1 w-full text-gray-900 rounded-lg border border-indigo-300 focus:outline-none px-3 py-2 hover:border-indigo-400"
                      placeholder="Surname"
                      value={form.employee_surname}
                      onChange={(e) =>
                        setForm({ ...form, employee_surname: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="font-medium text-sm text-gray-700">Email</label>
                    <input
                      className="mt-1 w-full text-gray-900 rounded-lg border border-indigo-300 focus:outline-none px-3 py-2 hover:border-indigo-400"
                      placeholder="Your Email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="font-medium text-sm text-gray-700">
                      Mobile Phone
                    </label>
                    <input
                      className="mt-1 w-full text-gray-900 rounded-lg border border-indigo-300 focus:outline-none px-3 py-2 hover:border-indigo-400"
                      placeholder="+66"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="font-medium text-sm text-gray-700">Address</label>
                  <textarea
                    className="mt-1 w-full text-gray-900 rounded-lg border border-indigo-300 focus:outline-none px-3 py-2 hover:border-indigo-400"
                    placeholder="Your Address"
                    rows={5}
                    value={form.address}
                    onChange={(e) =>
                      setForm({ ...form, address: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block font-medium text-sm text-black mb-1">
                    Department
                  </label>
                  <DepartmentSelected
                    val={form.department_id}
                    chage={(d: any) => {
                      {
                        setForm({ 
                          ...form, 
                          department_id: d.department_id,
                          department_name: d.department_name
                        });
                      }
                    }}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => setShow(false)}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button 
                    className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
                    onClick={onAddEmployee}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
