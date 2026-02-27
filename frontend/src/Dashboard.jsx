import { useEffect, useState } from "react";

export default function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    courseName: "",
    courseDescription: "",
    instructor: ""
  });

  const token = localStorage.getItem("token");

  const fetchCourses = async () => {
    const res = await fetch(
      `http://localhost:5000/api/courses?search=${search}`,
      {
        headers: { Authorization: token }
      }
    );

    const data = await res.json();
    if (Array.isArray(data)) {
      setCourses(data);
    } else {
      setCourses([]);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `http://localhost:5000/api/courses/${editingId}`
      : "http://localhost:5000/api/courses";

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify(form)
    });

    setForm({
      courseName: "",
      courseDescription: "",
      instructor: ""
    });

    setEditingId(null);
    fetchCourses();
  };

  const handleEdit = (course) => {
    setForm(course);
    setEditingId(course._id);
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/api/courses/${id}`, {
      method: "DELETE",
      headers: { Authorization: token }
    });

    fetchCourses();
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-600">
            Course Management Dashboard
          </h1>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {/* Create / Edit Form */}
        <div className="bg-white p-6 rounded-xl shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? "Edit Course" : "Add New Course"}
          </h2>

          <form onSubmit={handleSubmit} className="grid gap-4">
            <input
              className="border p-3 rounded-md"
              placeholder="Course Name"
              value={form.courseName}
              onChange={(e) =>
                setForm({ ...form, courseName: e.target.value })
              }
            />

            <input
              className="border p-3 rounded-md"
              placeholder="Course Description"
              value={form.courseDescription}
              onChange={(e) =>
                setForm({ ...form, courseDescription: e.target.value })
              }
            />

            <input
              className="border p-3 rounded-md"
              placeholder="Instructor"
              value={form.instructor}
              onChange={(e) =>
                setForm({ ...form, instructor: e.target.value })
              }
            />

            <button className="bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700">
              {editingId ? "Update Course" : "Add Course"}
            </button>
          </form>
        </div>

        {/* Search */}
        <div className="flex gap-4 mb-6">
          <input
            className="border p-3 rounded-md flex-1"
            placeholder="Search course..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={fetchCourses}
            className="bg-indigo-500 text-white px-6 rounded-md"
          >
            Search
          </button>
        </div>

        {/* Course List */}
        <div className="grid md:grid-cols-2 gap-6">
          {courses.length === 0 ? (
            <p className="text-gray-500">No courses found.</p>
          ) : (
            courses.map((course) => (
              <div
                key={course._id}
                className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
              >
                <h3 className="text-lg font-bold text-indigo-600">
                  {course.courseName}
                </h3>
                <p className="text-gray-600 mt-2">
                  {course.courseDescription}
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Instructor: {course.instructor}
                </p>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => handleEdit(course)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-md"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(course._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}