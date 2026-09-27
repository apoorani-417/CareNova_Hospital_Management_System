import { useEffect, useState } from "react";

import Patients from "./pages/Patients";
import Doctors from "./pages/Doctors";
import AddDoctor from "./pages/AddDoctor";
import AddPatient from "./pages/AddPatient";
import Appointments from "./pages/Appointment";
import MedicalRecords from "./pages/MedicalRecords";
import AddMedicalRecord from "./pages/AddMedicalRecord";
import AddAppointment from "./pages/AddAppointment";
import EditAppointment from "./pages/EditAppointment";
import EditPatient from "./pages/EditPatients";
import EditDoctor from "./pages/EditDoctor";
import EditMedicalRecord from "./pages/EditMedicalRecord";
import CareNovaChatBot from "./CareNovaChatbot";

function App() {
  const [activePage, setActivePage] = useState("dashboard");

  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [selectedMedicalRecordId, setSelectedMedicalRecordId] =
    useState(null);

  const [patientCount, setPatientCount] = useState(0);
  const [doctorCount, setDoctorCount] = useState(0);
  const [appointmentCount, setAppointmentCount] = useState(0);
  const [medicalRecordCount, setMedicalRecordCount] = useState(0);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchCounts = async () => {
    try {
      const [
        patientsResponse,
        doctorsResponse,
        appointmentsResponse,
        recordsResponse,
      ] = await Promise.all([
        fetch("http://localhost:8080/api/patients"),
        fetch("http://localhost:8080/api/doctors"),
        fetch("http://localhost:8080/api/appointments"),
        fetch("http://localhost:8080/api/medical-records"),
      ]);

      if (patientsResponse.ok) {
        const patients = await patientsResponse.json();
        setPatientCount(patients.length);
      }

      if (doctorsResponse.ok) {
        const doctors = await doctorsResponse.json();
        setDoctorCount(doctors.length);
      }

      if (appointmentsResponse.ok) {
        const appointments = await appointmentsResponse.json();
        setAppointmentCount(appointments.length);
      }

      if (recordsResponse.ok) {
        const records = await recordsResponse.json();
        setMedicalRecordCount(records.length);
      }
    } catch (error) {
      console.error("Error fetching dashboard counts:", error);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  const goToPage = (page) => {
    setActivePage(page);
    setSidebarOpen(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      ),
    },
    {
      id: "patients",
      label: "Patients",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      id: "doctors",
      label: "Doctors",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="9" cy="7" r="4" />
          <path d="M3 21v-2a6 6 0 0 1 12 0v2" />
          <path d="M19 8v6" />
          <path d="M16 11h6" />
        </svg>
      ),
    },
    {
      id: "appointments",
      label: "Appointments",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <path d="m8 15 2 2 5-5" />
        </svg>
      ),
    },
    {
      id: "medical-records",
      label: "Medical Records",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="8" y1="13" x2="16" y2="13" />
          <line x1="8" y1="17" x2="13" y2="17" />
        </svg>
      ),
    },
  ];

  const StatCard = ({
    title,
    value,
    subtitle,
    icon,
    iconBackground,
    iconColor,
    onClick,
  }) => {
    return (
      <button
        onClick={onClick}
        className="group w-full text-left bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {value}
            </p>

            <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
          </div>

          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBackground} ${iconColor} group-hover:scale-110 transition-transform`}
          >
            {icon}
          </div>
        </div>
      </button>
    );
  };

  const renderDashboard = () => {
    return (
      <div className="space-y-7">
        {/* Welcome Banner */}
        <section className="relative overflow-hidden rounded-2xl border border-blue-100 bg-[#eef7ff] shadow-sm">
          <div className="flex min-h-[198px] items-stretch">
            {/* LEFT */}
            <div className="relative z-10 flex w-[52%] flex-col justify-center px-7 py-7 sm:px-8 lg:px-9">
              <p className="text-[15px] font-medium text-[#164e8a]">
                Welcome to
              </p>

              <h1 className="mt-1 text-[38px] font-extrabold leading-tight tracking-tight text-[#062b61]">
                CareNova{" "}
                <span className="text-[#1268d8]">Hospital</span>
              </h1>

              <p className="mt-3 max-w-[610px] text-[15px] leading-6 text-[#41617f]">
                Manage patients, doctors, appointments and medical records
                from one secure and centralized hospital management system.
              </p>
            </div>

            {/* RIGHT MEDICAL IMAGE */}
            <div className="relative w-[48%] overflow-hidden">
              <img
                src="/carenova-stethoscope.jpeg"
                alt="CareNova Hospital"
                className="absolute inset-0 h-full w-full object-cover"
              />

              {/* LEFT BLEND */}
              <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-[#eef7ff] via-[#eef7ff]/70 to-transparent" />
            </div>
          </div>
        </section>

        {/* Overview */}
        <section>
          <div className="mb-5">
            <p className="text-sm font-semibold text-blue-600">
              Hospital Overview
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              Today's Management Summary
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              A quick overview of your hospital management data.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            <StatCard
              title="Total Patients"
              value={patientCount}
              subtitle="Registered patients"
              onClick={() => goToPage("patients")}
              iconBackground="bg-blue-50"
              iconColor="text-blue-600"
              icon={
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              }
            />

            <StatCard
              title="Total Doctors"
              value={doctorCount}
              subtitle="Available doctors"
              onClick={() => goToPage("doctors")}
              iconBackground="bg-emerald-50"
              iconColor="text-emerald-600"
              icon={
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="9" cy="7" r="4" />
                  <path d="M3 21v-2a6 6 0 0 1 12 0v2" />
                  <path d="M19 8v6" />
                  <path d="M16 11h6" />
                </svg>
              }
            />

            <StatCard
              title="Appointments"
              value={appointmentCount}
              subtitle="Scheduled appointments"
              onClick={() => goToPage("appointments")}
              iconBackground="bg-violet-50"
              iconColor="text-violet-600"
              icon={
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              }
            />

            <StatCard
              title="Medical Records"
              value={medicalRecordCount}
              subtitle="Patient medical records"
              onClick={() => goToPage("medical-records")}
              iconBackground="bg-amber-50"
              iconColor="text-amber-600"
              icon={
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="8" y1="13" x2="16" y2="13" />
                  <line x1="8" y1="17" x2="13" y2="17" />
                </svg>
              }
            />
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <div className="mb-5">
            <p className="text-sm font-semibold text-blue-600">
              Quick Access
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              Common Hospital Operations
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <button
              onClick={() => {
                setActivePage("add-patient");
                setSidebarOpen(false);
              }}
              className="group bg-white border border-slate-200 rounded-2xl p-6 text-left shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <svg
                  width="23"
                  height="23"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <line x1="19" y1="8" x2="19" y2="14" />
                  <line x1="16" y1="11" x2="22" y2="11" />
                </svg>
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-800">
                Add Patient
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Register a new patient in the hospital.
              </p>
            </button>

            <button
              onClick={() => {
                setActivePage("add-doctor");
                setSidebarOpen(false);
              }}
              className="group bg-white border border-slate-200 rounded-2xl p-6 text-left shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <svg
                  width="23"
                  height="23"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="9" cy="7" r="4" />
                  <path d="M3 21v-2a6 6 0 0 1 12 0v2" />
                  <line x1="19" y1="8" x2="19" y2="14" />
                  <line x1="16" y1="11" x2="22" y2="11" />
                </svg>
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-800">
                Add Doctor
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Register a doctor and their specialization.
              </p>
            </button>

            <button
              onClick={() => {
                setActivePage("add-appointment");
                setSidebarOpen(false);
              }}
              className="group bg-white border border-slate-200 rounded-2xl p-6 text-left shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center group-hover:bg-violet-600 group-hover:text-white transition-colors">
                <svg
                  width="23"
                  height="23"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                  <line x1="12" y1="14" x2="12" y2="18" />
                  <line x1="10" y1="16" x2="14" y2="16" />
                </svg>
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-800">
                New Appointment
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Schedule an appointment for a patient.
              </p>
            </button>

            <button
              onClick={() => {
                setActivePage("add-medical-record");
                setSidebarOpen(false);
              }}
              className="group bg-white border border-slate-200 rounded-2xl p-6 text-left shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <svg
                  width="23"
                  height="23"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="12" y1="12" x2="12" y2="18" />
                  <line x1="9" y1="15" x2="15" y2="15" />
                </svg>
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-800">
                Medical Record
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Create a new patient medical record.
              </p>
            </button>
          </div>
        </section>

        {/* Information Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 21h18" />
                  <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
                  <path d="M9 7h6" />
                  <path d="M9 11h6" />
                  <path d="M9 15h6" />
                </svg>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  CareNova Hospital
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  A centralized hospital management platform designed to
                  simplify patient care, doctor management, appointments and
                  medical records.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-sm">
            <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              System Status
            </p>

            <div className="flex items-center gap-3 mt-4">
              <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.7)]" />

              <span className="font-semibold">
                Hospital system active
              </span>
            </div>

            <p className="mt-3 text-sm text-slate-400 leading-6">
              All major management modules are available from the dashboard.
            </p>
          </div>
        </section>
      </div>
    );
  };

  const renderPage = () => {
    switch (activePage) {
      case "patients":
        return (
          <Patients
            onAddPatient={() => setActivePage("add-patient")}
            onEditPatient={(id) => {
              setSelectedPatientId(id);
              setActivePage("edit-patient");
            }}
          />
        );

      case "add-patient":
        return (
          <AddPatient
            onBack={() => {
              setActivePage("patients");
              fetchCounts();
            }}
          />
        );

      case "edit-patient":
        return (
          <EditPatient
            patientId={selectedPatientId}
            onBack={() => {
              setActivePage("patients");
              fetchCounts();
            }}
          />
        );

      case "doctors":
        return (
          <Doctors
            onAddDoctor={() => setActivePage("add-doctor")}
            onEditDoctor={(id) => {
              setSelectedDoctorId(id);
              setActivePage("edit-doctor");
            }}
          />
        );

      case "add-doctor":
        return (
          <AddDoctor
            onBack={() => {
              setActivePage("doctors");
              fetchCounts();
            }}
          />
        );

      case "edit-doctor":
        return (
          <EditDoctor
            doctorId={selectedDoctorId}
            onBack={() => {
              setActivePage("doctors");
              fetchCounts();
            }}
          />
        );

      case "appointments":
        return (
          <Appointments
            onAddAppointment={() => setActivePage("add-appointment")}
            onEditAppointment={(id) => {
              setSelectedAppointmentId(id);
              setActivePage("edit-appointment");
            }}
          />
        );

      case "add-appointment":
        return (
          <AddAppointment
            onBack={() => {
              setActivePage("appointments");
              fetchCounts();
            }}
          />
        );

      case "edit-appointment":
        return (
          <EditAppointment
            appointmentId={selectedAppointmentId}
            onBack={() => {
              setActivePage("appointments");
              fetchCounts();
            }}
          />
        );

      case "medical-records":
        return (
          <MedicalRecords
            onAddMedicalRecord={() =>
              setActivePage("add-medical-record")
            }
            onEditMedicalRecord={(id) => {
              setSelectedMedicalRecordId(id);
              setActivePage("edit-medical-record");
            }}
          />
        );

      case "add-medical-record":
        return (
          <AddMedicalRecord
            onBack={() => {
              setActivePage("medical-records");
              fetchCounts();
            }}
          />
        );

      case "edit-medical-record":
        return (
          <EditMedicalRecord
            recordId={selectedMedicalRecordId}
            onBack={() => {
              setActivePage("medical-records");
              fetchCounts();
            }}
          />
        );

      default:
        return renderDashboard();
    }
  };

  const pageTitle =
    activePage === "dashboard"
      ? "Dashboard"
      : activePage === "patients"
      ? "Patients"
      : activePage === "doctors"
      ? "Doctors"
      : activePage === "appointments"
      ? "Appointments"
      : activePage === "medical-records"
      ? "Medical Records"
      : activePage.includes("patient")
      ? "Patient Management"
      : activePage.includes("doctor")
      ? "Doctor Management"
      : activePage.includes("appointment")
      ? "Appointment Management"
      : "Medical Record Management";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <button
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-72 bg-slate-950 text-white flex flex-col transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Brand */}
        <div className="px-5 py-6 border-b border-white/10">
          <button
            onClick={() => goToPage("dashboard")}
            className="flex items-center gap-3 text-left w-full group"
          >
            {/* Logo */}
            <div className="relative w-12 h-12 shrink-0 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform duration-300">
              <div className="absolute inset-[2px] rounded-[14px] border border-white/20" />

              <svg
                width="29"
                height="29"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="relative"
              >
                <path d="M20.8 8.5c0-3-2.4-5.5-5.4-5.5-1.7 0-3.1.8-4.1 2.1C10.3 3.8 8.9 3 7.2 3 4.2 3 1.8 5.5 1.8 8.5c0 5.4 5.2 8.4 9.5 11.5 4.3-3.1 9.5-6.1 9.5-11.5Z" />
                <path d="M12 7v7" />
                <path d="M8.5 10.5h7" />
              </svg>
            </div>

            {/* Brand Name */}
            <div>
              <p className="text-[22px] font-extrabold tracking-tight text-white leading-none">
                CareNova
              </p>

              <p className="mt-1.5 text-[10px] uppercase tracking-[0.32em] text-blue-200 font-semibold">
                Hospital
              </p>
            </div>
          </button>
        </div>

        {/* Navigation */}
        <div className="px-4 py-6 flex-1 overflow-y-auto">
          <p className="px-3 mb-3 text-[11px] uppercase tracking-[0.18em] text-slate-500 font-bold">
            Main Menu
          </p>

          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const active = activePage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => goToPage(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    active
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.icon}

                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-8 px-3 mb-3 text-[11px] uppercase tracking-[0.18em] text-slate-500 font-bold">
            Quick Actions
          </div>

          <div className="space-y-2">
            <button
              onClick={() => {
                setActivePage("add-patient");
                setSidebarOpen(false);
              }}
              className="w-full text-left px-4 py-3 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-white/5"
            >
              + Add Patient
            </button>

            <button
              onClick={() => {
                setActivePage("add-appointment");
                setSidebarOpen(false);
              }}
              className="w-full text-left px-4 py-3 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-white/5"
            >
              + New Appointment
            </button>
          </div>
        </div>

        {/* Sidebar Bottom */}
        <div className="p-4 border-t border-white/10">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-white">
                  Hospital Admin
                </p>

                <p className="text-xs text-slate-500 truncate">
                  CareNova Hospital
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <div className="lg:ml-72 min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200">
          <div className="h-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center"
              >
                <svg
                  width="21"
                  height="21"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>

              <div>
                <p className="text-xs text-slate-400 font-medium">
                  CareNova Hospital
                </p>

                <h1 className="text-xl font-bold text-slate-900">
                  {pageTitle}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                System Online
              </div>

              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                HA
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="px-4 sm:px-6 lg:px-8 py-7 lg:py-9 max-w-[1600px] mx-auto">
          {renderPage()}
        </main>

        {/* Footer */}
        <footer className="mt-10 bg-slate-950 text-white">
          <div className="mx-auto max-w-7xl px-6 py-12">
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

              {/* Hospital */}
              <div>
                <h3 className="text-2xl font-bold text-white">
                  CareNova Hospital
                </h3>

                <p className="mt-4 text-sm leading-6 text-slate-300">
                  Providing trusted healthcare services with modern facilities,
                  experienced doctors and patient-focused care.
                </p>

                <div className="mt-5 inline-flex items-center rounded-full bg-blue-600/20 px-4 py-2 text-sm font-semibold text-blue-300">
                  🏥 24/7 Healthcare Service
                </div>
              </div>

              {/* Contact */}
              <div>
                <h4 className="text-lg font-semibold">
                  Contact Us
                </h4>

                <div className="mt-4 space-y-3 text-sm text-slate-300">
                  <p>📞 +91 98765 43210</p>
                  <p>🚨 Emergency: +91 98765 43211</p>
                  <p>✉️ contact@carenovahospital.com</p>
                </div>
              </div>

              {/* Address */}
              <div>
                <h4 className="text-lg font-semibold">
                  Hospital Address
                </h4>

                <p className="mt-4 text-sm leading-6 text-slate-300">
                  📍 123, Avinashi Road,
                  <br />
                  Peelamedu,
                  <br />
                  Coimbatore, Tamil Nadu
                  <br />
                  641004
                </p>

                <a
                  href="https://www.google.com/maps/search/?api=1&query=CareNova+Hospital+123+Avinashi+Road+Peelamedu+Coimbatore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  📍 View on Google Maps
                </a>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-lg font-semibold">
                  Quick Links
                </h4>

                <div className="mt-4 flex flex-col items-start gap-3 text-sm">
                  <button
                    onClick={() => goToPage("dashboard")}
                    className="text-slate-300 hover:text-white"
                  >
                    Dashboard
                  </button>

                  <button
                    onClick={() => goToPage("patients")}
                    className="text-slate-300 hover:text-white"
                  >
                    Patients
                  </button>

                  <button
                    onClick={() => goToPage("doctors")}
                    className="text-slate-300 hover:text-white"
                  >
                    Doctors
                  </button>

                  <button
                    onClick={() => goToPage("appointments")}
                    className="text-slate-300 hover:text-white"
                  >
                    Appointments
                  </button>

                  <button
                    onClick={() => goToPage("medical-records")}
                    className="text-slate-300 hover:text-white"
                  >
                    Medical Records
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-10 border-t border-slate-800 pt-6 text-center text-sm text-slate-400">
              © 2026 CareNova Hospital. All Rights Reserved.
            </div>
          </div>
        </footer>
      </div>

      {/* CareNova AI Chatbot */}
      <CareNovaChatBot />
    </div>
  );
}

export default App;