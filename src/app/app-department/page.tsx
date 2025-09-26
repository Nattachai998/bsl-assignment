"use client";

import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

import { Department } from "@/lib/type";
import { DepartmentSelected } from "@/components/ui/Dropdown";

export default function DepartmentPage() {
  const Swal = require("sweetalert2");

  // Form Controller
  const [form, setForm] = useState<Department>({
    department_id: "",
    department_name: "",
    title: "",
  });

  // Save
  const onSubmit = async () => {
    if (form.department_name == "" || form.title == "") {
      Swal.fire("Error", "กรอกข้อมูลให้ครบถ้วน", "error");
      return;
    }

    Swal.fire({
      icon: "question",
      title: "Do you want to Save Data?",
      text: "Please verify the information before saving.",
      showDenyButton: true,
      confirmButtonText: "Save",
    }).then((result: any) => {
      if (result.isConfirmed) {
        fetch("/api/department", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "createDepartment", payload: form }),
        })
          .then((resData) => {
            if (!resData.ok) throw new Error("Data Error");

            resData.json().then(() => {
              Swal.fire("Saved!", "", "success");
              setForm({
                department_id: "",
                department_name: "",
                title: "",
              });
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

  
  return (
    <div className="bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-xl font-semibold text-gray-800 mb-4">
          {/* ➕ Add Department */}
          Add Department
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Fill in the details below to create a new department.
        </p>

        <div className="space-y-4">
          <div>
            <label  
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Department Name
            </label>
            <input
              type="text"
              value={form.department_name}
              onChange={(e) =>
                setForm({ ...form, department_name: e.target.value })
              }
                placeholder="Enter department name"
              className="w-full text-gray-900 rounded-lg border border-indigo-300 focus:outline-none px-3 py-2 hover:border-indigo-400"
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Short description about the department"
              rows={5}
              className="w-full text-gray-700 rounded-lg border border-indigo-300 focus:outline-none px-3 py-2 hover:border-indigo-400"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
              onClick={() =>
                setForm({ department_id: "", department_name: "", title: "" })
              }
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
              onClick={onSubmit}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
