import { useEffect, useState } from "react";

function EditPatient({ patientId, onBack }) {
  const [patient, setPatient] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    age: "",
    gender: "",
    medicalHistory: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/patients/${patientId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch patient");
        }

        const data = await response.json();

        setPatient({
          name: data.name ?? "",
          email: data.email ?? "",
          phone: data.phone ?? "",
          address: data.address ?? "",
          age: data.age ?? "",
          gender: data.gender ?? "",
          medicalHistory: data.medicalHistory ?? "",
        });
      } catch (error) {
        console.error("Error fetching patient:", error);
        alert("Failed to load patient");
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchPatient();
    }
  }, [patientId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setPatient((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);

    try {
      const response = await fetch(
        `http://localhost:8080/api/patients/${patientId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...patient,
            age: Number(patient.age),
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Backend error:", errorData);
        throw new Error("Failed to update patient");
      }

      alert("Patient updated successfully!");

      onBack();
    } catch (error) {
      console.error("Error updating patient:", error);
      alert("Failed to update patient");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <p className="text-slate-500">Loading patient...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">
          Edit Patient
        </h1>

        <p className="text-slate-500 mt-1">
          Update patient information and medical history
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Name + Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Patient Name
              </label>

              <input
                type="text"
                name="name"
                value={patient.name}
                onChange={handleChange}
                required
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter patient name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={patient.email}
                onChange={handleChange}
                required
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter email"
              />
            </div>

          </div>

          {/* Phone + Age */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Phone
              </label>

              <input
                type="tel"
                name="phone"
                value={patient.phone}
                onChange={handleChange}
                required
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Age
              </label>

              <input
                type="number"
                name="age"
                min="0"
                value={patient.age}
                onChange={handleChange}
                required
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter age"
              />
            </div>

          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Gender
            </label>

            <select
              name="gender"
              value={patient.gender}
              onChange={handleChange}
              required
              className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Address
            </label>

            <textarea
              name="address"
              value={patient.address}
              onChange={handleChange}
              required
              rows="3"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Enter patient address"
            />
          </div>

          {/* Medical History */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Medical History
            </label>

            <textarea
              name="medicalHistory"
              value={patient.medicalHistory}
              onChange={handleChange}
              rows="5"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Enter patient's medical history"
            />

            <p className="text-xs text-slate-400 mt-2">
              Include previous illnesses, allergies, surgeries, or other relevant medical information.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3 pt-2">

            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {saving ? "Updating..." : "Update Patient"}
            </button>

            <button
              type="button"
              onClick={onBack}
              disabled={saving}
              className="bg-slate-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-slate-600 disabled:opacity-60 transition"
            >
              Back
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}

export default EditPatient;