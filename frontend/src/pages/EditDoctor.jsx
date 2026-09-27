import { useEffect, useState } from "react";

function EditDoctor({ doctorId, onBack }) {
  const [doctor, setDoctor] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    gender: "",
    experience: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `http://localhost:8080/api/doctors/${doctorId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch doctor");
        }

        const data = await response.json();

        setDoctor({
          name: data.name ?? "",
          email: data.email ?? "",
          phone: data.phone ?? "",
          specialization: data.specialization ?? "",
          gender: data.gender ?? "",
          experience: data.experience ?? "",
        });
      } catch (error) {
        console.error("Error fetching doctor:", error);
        alert("Failed to load doctor");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [doctorId]);

  const handleChange = (e) => {
    setDoctor({
      ...doctor,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const response = await fetch(
        `http://localhost:8080/api/doctors/${doctorId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...doctor,
            experience: Number(doctor.experience),
          }),
        }
      );

      if (response.ok) {
        alert("Doctor updated successfully!");
        onBack();
      } else {
        const errorData = await response.text();
        console.error("Backend error:", errorData);
        alert("Failed to update doctor");
      }
    } catch (error) {
      console.error("Error updating doctor:", error);
      alert("Backend connection error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <div className="inline-block w-8 h-8 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />

          <p className="mt-4 text-gray-500">
            Loading doctor...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">

        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Edit Doctor
          </h1>

          <p className="text-gray-500 mt-1">
            Update doctor details
          </p>
        </div>

        <button
          type="button"
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
                Experience (Years)
              </label>

              <input
                type="number"
                name="experience"
                min="0"
                value={doctor.experience}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter experience"
              />
            </div>

          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-6">

            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {saving ? "Updating..." : "Update Doctor"}
            </button>

            <button
              type="button"
              onClick={onBack}
              disabled={saving}
              className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 disabled:bg-gray-300"
            >
              Cancel
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default EditDoctor;