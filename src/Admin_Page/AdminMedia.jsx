import React, { useEffect, useState } from "react";

import {
  uploadAdminMedia,
  getAdminMedia,
  deleteAdminMedia,
  updateAdminMediaStatus,
} from "../api/adminApi";
import { FaUpload, FaTrash, FaSearch, FaImage, FaVideo, FaFilePdf } from "react-icons/fa";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const formatFileSize = (bytes) => {
  if (!bytes) return "0 B";
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
};

const AdminMedia = () => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [mediaType, setMediaType] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const res = await getAdminMedia({
        search: search || undefined,
        media_type: mediaType || undefined,
      });
      setItems(res.data.items || []);
    } catch (err) {
      console.error("Fetch media failed", err);
      alert(err?.response?.data?.detail || "Failed to load media");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [search, mediaType]);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Title is required");
      return;
    }

    if (!file) {
      alert("Please choose a file");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("file", file);

      await uploadAdminMedia(formData);

      setTitle("");
      setFile(null);
      setFileInputKey(Date.now());
      fetchMedia();
    } catch (err) {
      alert(err?.response?.data?.detail || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this media?")) return;
    try {
      await deleteAdminMedia(id);
      fetchMedia();
    } catch (err) {
      alert(err?.response?.data?.detail || "Delete failed");
    }
  };

  const handleToggle = async (item) => {
    try {
      await updateAdminMediaStatus(item.id, !item.is_active);
      fetchMedia();
    } catch (err) {
      alert(err?.response?.data?.detail || "Status update failed");
    }
  };

  const renderPreview = (item) => {
    const src = `${API_BASE}${item.file_url}`;

    if (item.media_type === "image") {
      return (
        <img
          src={src}
          alt={item.title}
          className="w-full h-44 object-cover rounded-xl"
        />
      );
    }

    if (item.media_type === "video") {
      return (
        <video
          src={src}
          controls
          className="w-full h-44 object-cover rounded-xl bg-black"
        />
      );
    }

    return (
      <div className="w-full h-44 rounded-xl bg-red-50 flex items-center justify-center text-red-600 text-4xl">
        <FaFilePdf />
      </div>
    );
  };

  const getIcon = (type) => {
    if (type === "image") return <FaImage />;
    if (type === "video") return <FaVideo />;
    return <FaFilePdf />;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Media Management</h2>
        <p className="text-sm text-gray-500 mt-1">
          Upload and manage admin media files
        </p>
      </div>

      {/* Upload Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Media Title
              </label>
              <input
                type="text"
                placeholder="Enter media title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select File
              </label>
              <input
                key={fileInputKey}
                type="file"
                accept=".jpg,.jpeg,.png,.webp,.mp4,.webm,.mov,.pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition"
          >
            <FaUpload />
            {uploading ? "Uploading..." : "Upload Media"}
          </button>
        </form>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-56">
          <FaSearch className="absolute left-3 top-3 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search media..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <select
          value={mediaType}
          onChange={(e) => setMediaType(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="">All Types</option>
          <option value="image">Images</option>
          <option value="video">Videos</option>
          <option value="document">Documents</option>
        </select>
      </div>

      {/* Media Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full text-center py-10 text-gray-400">
            Loading media...
          </div>
        ) : items.length === 0 ? (
          <div className="col-span-full text-center py-10 text-gray-400">
            No media found
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-4"
            >
              {renderPreview(item)}

              <div>
                <div className="flex items-center gap-2 text-sm text-indigo-600 font-medium">
                  {getIcon(item.media_type)}
                  <span className="capitalize">{item.media_type}</span>
                </div>

                <h3 className="font-semibold text-gray-800 mt-2 truncate">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1 truncate">
                  {item.original_name}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {formatFileSize(item.file_size)}
                </p>
              </div>

              <div className="flex items-center justify-between gap-2">
                <a
        
                  href={`${API_BASE}${item.file_url}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2 rounded-lg text-sm bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition"
                >
                  Open
                </a>

                <button
                  onClick={() => handleToggle(item)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    item.is_active
                      ? "bg-green-50 text-green-700 hover:bg-green-100"
                      : "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                  }`}
                >
                  {item.is_active ? "Active" : "Inactive"}
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                  title="Delete"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminMedia;