import { useEffect, useState } from "react";

function Doctors({ onAddDoctor, onEditDoctor }) {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchDoctors = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:8080/api/doctors"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch doctors");
      }

      const data = await response.json();
      setDoctors(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this doctor?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/doctors/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setDoctors((currentDoctors) =>
          currentDoctors.filter(
            (doctor) =>
              Number(doctor.id) !== Number(id)
          )
        );

        alert("Doctor deleted successfully!");
      } else {
        alert("Failed to delete doctor");
      }
    } catch (error) {
      console.error("Error deleting doctor:", error);
      alert("Backend connection error");
    }
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const search = searchTerm.trim().toLowerCase();

    return (
      String(doctor.id || "")
        .toLowerCase()
        .includes(search) ||
      String(doctor.name || "")
        .toLowerCase()
        .includes(search) ||
      String(doctor.email || "")
        .toLowerCase()
        .includes(search) ||
      String(doctor.phone || "")
        .toLowerCase()
        .includes(search) ||
      String(doctor.specialization || "")
        .toLowerCase()
        .includes(search) ||
      String(doctor.gender || "")
        .toLowerCase()
        .includes(search)
    );
  });

  return (
    <div className="space-y-6">

      {/* =========================
          PAGE HEADER
      ========================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Doctor Management
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Manage doctors, specializations and professional details
          </p>
        </div>

        <button
          onClick={onAddDoctor}
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all"
        >
          <span className="text-xl leading-none">
            +
          </span>

          Add Doctor
        </button>
      </div>

      {/* =========================
          SEARCH + SUMMARY
      ========================= */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

          {/* SEARCH */}
          <div className="relative w-full lg:max-w-md">

            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle
                cx="11"
                cy="11"
                r="8"
              />

              <line
                x1="21"
                y1="21"
                x2="16.65"
                y2="16.65"
              />
            </svg>

            <input
              type="text"
              placeholder="Search doctors..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-sm text-slate-700 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all"
            />

          </div>

          {/* TOTAL DOCTORS */}
          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              {doctors.length}
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-700">
                Total Doctors
              </p>

              <p className="text-xs text-slate-400">
                Registered doctors
              </p>
            </div>

          </div>

        </div>
      </div>

      {/* =========================
          DOCTOR TABLE
      ========================= */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

        {/* TABLE TITLE */}
        <div className="px-6 py-5 border-b border-slate-200">

          <h3 className="font-bold text-slate-800">
            Doctor List
          </h3>

          <p className="text-xs text-slate-400 mt-1">
            {filteredDoctors.length} doctor
            {filteredDoctors.length !== 1
              ? "s"
              : ""}{" "}
            found
          </p>

        </div>

        {/* LOADING */}
        {loading ? (

          <div className="py-16 text-center">

            <div className="inline-block w-8 h-8 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />

            <p className="mt-4 text-sm text-slate-500">
              Loading doctors...
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1200px] table-fixed">

              {/* =========================
                  COLUMN WIDTHS
              ========================= */}
              <colgroup>
                <col className="w-[90px]" />
                <col className="w-[210px]" />
                <col className="w-[250px]" />
                <col className="w-[170px]" />
                <col className="w-[210px]" />
                <col className="w-[120px]" />
                <col className="w-[140px]" />
                <col className="w-[220px]" />
              </colgroup>

              {/* =========================
                  TABLE HEADER
              ========================= */}
              <thead>

                <tr className="bg-slate-50 border-b border-slate-200">

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                    ID
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                    Doctor
                  </th>

                  {/* EMAIL HEADER ONLY CENTER */}
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                    Email
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                    Phone
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                    Specialization
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                    Gender
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                    Experience
                  </th>

                  <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                    Actions
                  </th>

                </tr>

              </thead>

              {/* =========================
                  TABLE BODY
              ========================= */}
              <tbody className="divide-y divide-slate-100">

                {filteredDoctors.length === 0 ? (

                  <tr>

                    <td
                      colSpan="8"
                      className="px-6 py-16 text-center"
                    >

                      <div className="mx-auto w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">

                        <svg
                          width="27"
                          height="27"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle
                            cx="12"
                            cy="7"
                            r="4"
                          />

                          <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
                        </svg>

                      </div>

                      <p className="mt-4 font-semibold text-slate-700">
                        No doctors found
                      </p>

                      <p className="mt-1 text-sm text-slate-400">
                        Try another search or add a new doctor.
                      </p>

                    </td>

                  </tr>

                ) : (

                  filteredDoctors.map((doctor) => (

                    <tr
                      key={doctor.id}
                      className="hover:bg-slate-50 transition-colors"
                    >

                      {/* =========================
                          ID
                      ========================= */}
                      <td className="px-6 py-5 align-middle">

                        <span className="inline-flex items-center justify-center min-w-10 h-8 px-2.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold">
                          #{doctor.id}
                        </span>

                      </td>

                      {/* =========================
                          DOCTOR
                      ========================= */}
                      <td className="px-6 py-5 align-middle">

                        <div className="min-w-0">

                          <p className="text-sm font-semibold text-slate-800 truncate">
                            {doctor.name || "-"}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            ID: {doctor.id}
                          </p>

                        </div>

                      </td>

                      {/* =========================
                          EMAIL DATA - LEFT
                      ========================= */}
                      <td className="px-6 py-5 align-middle">

                        <p
                          className="text-sm text-slate-600 truncate"
                          title={doctor.email || ""}
                        >
                          {doctor.email || "-"}
                        </p>

                      </td>

                      {/* =========================
                          PHONE
                      ========================= */}
                      <td className="px-6 py-5 align-middle">

                        <p className="text-sm text-slate-600 whitespace-nowrap">
                          {doctor.phone || "-"}
                        </p>

                      </td>

                      {/* =========================
                          SPECIALIZATION
                      ========================= */}
                      <td className="px-6 py-5 align-middle">

                        <span
                          className="inline-flex items-center px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold whitespace-nowrap max-w-full truncate"
                          title={doctor.specialization || ""}
                        >
                          {doctor.specialization || "-"}
                        </span>

                      </td>

                      {/* =========================
                          GENDER
                      ========================= */}
                      <td className="px-6 py-5 align-middle">

                        <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-semibold whitespace-nowrap">
                          {doctor.gender || "-"}
                        </span>

                      </td>

                      {/* =========================
                          EXPERIENCE
                      ========================= */}
                      <td className="px-6 py-5 align-middle">

                        <span className="text-sm font-semibold text-slate-700 whitespace-nowrap">
                          {doctor.experience ?? "-"} years
                        </span>

                      </td>

                      {/* =========================
                          ACTIONS
                      ========================= */}
                      <td className="px-6 py-5 align-middle">

                        <div className="flex items-center justify-center gap-2 whitespace-nowrap">

                          {/* EDIT */}
                          <button
                            onClick={() =>
                              onEditDoctor(
                                doctor.id
                              )
                            }
                            className="inline-flex items-center justify-center gap-1.5 min-w-[78px] px-3 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white text-xs font-semibold transition-colors"
                          >

                            <svg
                              width="15"
                              height="15"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M12 20h9" />
                              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
                            </svg>

                            Edit

                          </button>

                          {/* DELETE */}
                          <button
                            onClick={() =>
                              handleDelete(
                                doctor.id
                              )
                            }
                            className="inline-flex items-center justify-center gap-1.5 min-w-[88px] px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white text-xs font-semibold transition-colors"
                          >

                            <svg
                              width="15"
                              height="15"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                              <path d="M10 11v6" />
                              <path d="M14 11v6" />
                              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                            </svg>

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

        )}

      </div>

    </div>
  );
}

export default Doctors;