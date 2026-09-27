import { useState } from "react";

function AddDoctor({ onBack }) {
  const [doctor, setDoctor] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    gender: "",
    experience: "",
  });

  const handleChange = (e) => {
    setDoctor({
      ...doctor,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/doctors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...doctor,
          experience: Number(doctor.experience),
        }),
      });

      if (response.ok) {
        alert("Doctor added successfully!");
        onBack();
      } else {
        const errorData = await response.text();
        console.error("Backend error:", errorData);
        alert("Failed to add doctor");
      }
    } catch (error) {
      console.error("Error adding doctor:", error);
      alert("Backend connection error");
    }
  };

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">

        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Add Doctor
          </h1>

          <p className="text-gray-500 mt-1">
            Add a new hospital doctor
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
                value={doctor.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter doctor name"
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
                value={doctor.email}
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
                value={doctor.phone}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter phone number"
              />
            </div>

            {/* Specialization */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specialization
              </label>

              <input
                type="text"
                name="specialization"
                value={doctor.specialization}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter specialization"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>

              <select
                name="gender"
                value={doctor.gender}
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

            {/* Experience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience
              </label>

              <input
                type="number"
                name="experience"
                min="0"
                value={doctor.experience}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter experience in years"
              />
            </div>

          </div>

          {/* Submit */}
          <div className="mt-6">

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Add Doctor
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default AddDoctor;