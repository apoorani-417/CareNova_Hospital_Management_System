import { useState } from "react";

function AddPatient({ onBack }) {
  const [patient, setPatient] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    age: "",
    gender: "",
    medicalHistory: "",
  });

  const handleChange = (e) => {
    setPatient({
      ...patient,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/patients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...patient,
          age: Number(patient.age),
        }),
      });

      if (response.ok) {
        alert("Patient added successfully!");
        onBack();
      } else {
        const errorData = await response.text();
        console.error("Backend error:", errorData);
        alert("Failed to add patient");
      }
    } catch (error) {
      console.error("Error adding patient:", error);
      alert("Backend connection error");
    }
  };

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">

        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Add Patient
          </h1>

          <p className="text-gray-500 mt-1">
            Add a new hospital patient
          </p>
        </div>

        <button
          onClick={onBack}
          className="bg-gray-500 text-white px-5 py-2 rounded-lg hover:bg-gray-600"
        >
          Back
        </button>

      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow p-6 max-w-3xl">

        <form onSubmit={handleSubmit}>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>

              <input
                type="text"
                name="name"
                value={patient.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter patient name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={patient.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter email"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>

              <input
                type="tel"
                name="phone"
                value={patient.phone}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter phone number"
              />
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age
              </label>

              <input
                type="number"
                name="age"
                min="0"
                value={patient.age}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter age"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>

              <select
                name="gender"
                value={patient.gender}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>

              <input
                type="text"
                name="address"
                value={patient.address}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter address"
              />
            </div>

          </div>

          {/* Medical History */}
          <div className="mt-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Medical History
            </label>

            <textarea
              name="medicalHistory"
              value={patient.medicalHistory}
              onChange={handleChange}
              rows="5"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Enter patient's medical history"
            ></textarea>
          </div>

          {/* Submit */}
          <div className="mt-6">

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Add Patient
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default AddPatient;