"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

import { Employee } from "@/lib/type";

export default function EmployeeProfile() {
  const router = useRouter();
  const Swal = require("sweetalert2");

  const searchParams = useSearchParams();
  const emp_id = searchParams.get("emp_id");

  const profileMock = {
    manager: "Somchai Chairat",
    lastLogin: "26/09/2025 14:32",
    kpi: { onTime: 96, bugs: 3 },
    leave: { total: 12, used: 5 },
    skills: ["Next.js", "Node.js", "TypeScript", "Tailwind", "SQL"],
    weeklyActivity: [3, 6, 4, 7, 5, 2, 8],
  };

  const barW = 10, gap = 6, chartH = 36;
  const maxVal = Math.max(...profileMock.weeklyActivity, 1);
  const bars = profileMock.weeklyActivity.map((v, i) => {
    const h = Math.round((v / maxVal) * (chartH - 4));
    const x = i * (barW + gap);
    const y = chartH - h;
    return { x, y, h };
  });
  const chartWidth = profileMock.weeklyActivity.length * barW + (profileMock.weeklyActivity.length - 1) * gap;

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
  const onGetEmplooye = async () => {
    const res = await fetch("/api/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "getEmployee", payload: emp_id }),
    });

    if (!res.ok) throw new Error("Data Error");
    const json = await res.json();
    setForm({
      employee_id: json.data.employee_id,
      employee_no: json.data.employee_no,
      employee_name: json.data.employee_name,
      employee_surname: json.data.employee_surname,
      address: json.data.address,
      phone: json.data.phone,
      create_date: json.data.create_date,
      update_date: json.data.update_date,
      delete_flag: json.data.delete_flag,
      department_name: json.data.department_name,
      department_id: json.data.department_id,
      email: json.data.email,
    });
  };

  const onSave = async () => {
    Swal.fire({
      icon: "question",
      title: "Do you want to Save Data?",
      text: "Please verify the information before saving.",
      showDenyButton: true,
      confirmButtonText: "Save",
    }).then((result: any) => {
      if (result.isConfirmed) {
        fetch("/api/history", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "updateEmployee", payload: form }),
        })
          .then((resData) => {
            if (!resData.ok) throw new Error("Data Error");

            resData.json().then(() => {
              Swal.fire("Saved!", "", "success");
              onGetEmplooye();
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

  useEffect(() => {
    onGetEmplooye();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="mt-4 border-b bg-slate-50 items-center">
        {/* Go Back */}
        <Link
          href="/app-history"
          className="flex ml-5 items-start gap-2 text-slate-600 hover:text-slate-800"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span className="text-sm">ย้อนกลับ</span>
        </Link>
        <div className="mt-0 ml-60 max-w-6xl px-4 py-4 gap-4">
          <div>
            <h1 className="text-xl font-semibold text-slate-800">
              ข้อมูลของฉัน
            </h1>
            <p className="text-sm text-slate-500">
              จัดการข้อมูลส่วนตัวและความปลอดภัยของบัญชีผู้ใช้
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Left: form */}
          <div className="md:col-span-2">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="grid grid-cols-1 gap-5">
                {/* ชื่อผู้ใช้ (ใช้ employee_no แทน) */}
                <div>
                  <label className="mb-1 block text-sm text-slate-700">
                    รหัสผู้ใช้งาน
                  </label>
                  <input
                    value={form.employee_no || ""}
                    onChange={(e) =>
                      setForm({ ...form, employee_no: e.target.value })
                    }
                    className="w-full cursor-not-allowed rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600"                    
                    placeholder="EMP-XXXXX"
                    disabled
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    คุณสามารถแก้ไขชื่อผู้ใช้ได้เพียงครั้งเดียวเท่านั้น
                  </p>
                </div>

                <div>
                  <label className="mb-1 block text-sm text-slate-700">
                    ชื่อ
                  </label>
                  <input
                    value={form.employee_name || ""}
                    onChange={(e) =>
                      setForm({ ...form, employee_name: e.target.value })
                    }
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="ชื่อ"
                  />
                </div>

                {/* นามสกุล */}
                <div>
                  <label className="mb-1 block text-sm text-slate-700">
                    นามสกุล
                  </label>
                  <input
                    value={form.employee_surname || ""}
                    onChange={(e) =>
                      setForm({ ...form, employee_surname: e.target.value })
                    }
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="นามสกุล"
                  />
                </div>

                {/* อีเมล */}
                <div>
                  <label className="mb-1 block text-sm text-slate-700">
                    อีเมล
                  </label>
                  <input
                    type="email"
                    value={form.email || ""}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="name@example.com"
                  />
                  <div className="mt-1">
                    <button
                      type="button"
                      className="text-xs font-medium text-indigo-600 hover:underline"
                    >
                      เพิ่ม
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm text-slate-700">
                    หมายเลขโทรศัพท์
                  </label>
                  <input
                    value={form.phone || ""}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="08xxxxxxxx"
                  />
                  <div className="mt-1">
                    <button
                      type="button"
                      className="text-xs font-medium text-indigo-600 hover:underline"
                    >
                      เปลี่ยน
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm text-slate-700">
                    แผนก
                  </label>
                  <input
                    value={form.department_name || "-"}
                    disabled
                    className="w-full cursor-not-allowed rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600"
                  />
                </div>

                {/* ที่อยู่ */}
                <div>
                  <label className="mb-1 block text-sm text-slate-700">
                    ที่อยู่
                  </label>
                  <textarea
                    value={form.address || ""}
                    onChange={(e) =>
                      setForm({ ...form, address: e.target.value })
                    }
                    className="h-24 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="ที่อยู่"
                  />
                </div>

                <div className="flex justify-center pt-2" onClick={onSave}>
                  <button className="rounded-md bg-indigo-600 px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    บันทึก
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right: avatar */}
          <div className="md:col-span-1">
            <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
              <div className="mx-auto mb-4 h-28 w-28 overflow-hidden rounded-full border border-slate-200">
                <img
                  src="https://api.dicebear.com/7.x/adventurer/svg?seed=panda"
                  alt="avatar"
                  className="h-full w-full object-cover"
                />
              </div>
              <button
                type="button"
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                เลือกรูป
              </button>
              <p className="mt-3 text-xs text-slate-500">
                ขนาดไฟล์: สูงสุด 1 MB <br /> ไฟล์รองรับ: .JPEG, .PNG
              </p>

              <div className="mt-6 grid gap-2 text-left text-xs text-slate-500">
                <div>
                  สร้างเมื่อ:{" "}
                  <span className="font-medium text-slate-700">
                    {form.create_date
                      ? new Date(form.create_date).toLocaleDateString()
                      : "-"}
                  </span>
                </div>
                <div>
                  อัปเดตล่าสุด:{" "}
                  <span className="font-medium text-slate-700">
                    {form.update_date
                      ? new Date(form.update_date).toLocaleDateString()
                      : "-"}
                  </span>
                </div>
              </div>
            </div>

            {/* Under: avatar */}
            <div className="text-left mt-6 space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">หัวหน้างาน</span>
                  <span className="text-sm font-medium text-slate-800">
                    {profileMock.manager}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    เข้าสู่ระบบล่าสุด
                  </span>
                  <span className="text-xs font-medium text-slate-700">
                    {new Date(form.create_date).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg border border-slate-100 p-3">
                  <div className="text-[10px] text-slate-500">
                    On-time Tasks
                  </div>
                  <div className="mt-1 text-lg font-semibold text-slate-800">
                    {profileMock.kpi.onTime}%
                  </div>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-indigo-600"
                      style={{ width: `${profileMock.kpi.onTime}%` }}
                    />
                  </div>
                </div>
                <div className="rounded-lg border border-slate-100 p-3">
                  <div className="text-[10px] text-slate-500">Open Bugs</div>
                  <div className="mt-1 text-lg font-semibold text-slate-800">
                    {profileMock.kpi.bugs}
                  </div>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-rose-500"
                      style={{
                        width: `${Math.min(profileMock.kpi.bugs * 20, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-slate-100 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-500">
                    สิทธิ์ลาพักร้อน
                  </span>
                  <span className="text-xs font-medium text-slate-700">
                    ใช้แล้ว {profileMock.leave.used}/{profileMock.leave.total}{" "}
                    วัน
                  </span>
                </div>
                <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-emerald-600"
                    style={{
                      width: `${
                        (profileMock.leave.used / profileMock.leave.total) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div className="rounded-lg border border-slate-100 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-800">
                    กิจกรรมรายสัปดาห์
                  </span>
                  <span className="text-xs text-slate-500">ครั้ง</span>
                </div>
                <svg width={chartWidth} height={chartH} className="mt-2 block">
                  {bars.map((b, idx) => (
                    <rect
                      key={idx}
                      x={b.x}
                      y={b.y}
                      width={barW}
                      height={b.h}
                      rx="2"
                      className="fill-indigo-600"
                    />
                  ))}
                </svg>
              </div>

              {/* ทักษะ */}
              <div>
                <div className="text-sm font-medium text-slate-800 mb-2">
                  ทักษะ
                </div>
                <div className="flex flex-wrap gap-2">
                  {profileMock.skills.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700 hover:bg-gray-200"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
