import "./ProjectRequests.css";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaSearch,
  FaSortAmountDown,
  FaSortAmountUp,
  FaWhatsapp,
  FaEnvelope,
  FaDownload,
  FaEye,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaPhone,
  FaFileAlt,
  FaFilter,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaUser,
  FaRupeeSign,
  FaTags,
  FaNotesMedical,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

const ProjectRequests = ({ url }) => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [statusFilter, setStatusFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [expandedRequest, setExpandedRequest] = useState(null);
  const [stats, setStats] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    requestId: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch all project requests
  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const adminAuth = JSON.parse(localStorage.getItem("adminAuth"));
      if (!adminAuth || !adminAuth.email) {
        console.error("No admin auth found");
        toast.error("Admin authentication required");
        navigate("/login");
        return;
      }

      console.log(
        "Fetching project requests with admin email:",
        adminAuth.email
      );
      const response = await axios.get(
        `${url || import.meta.env.VITE_BACKEND_URL || "http://localhost:4000"}/api/contact/all`,
        {
          headers: {
            "admin-email": adminAuth.email,
          },
        }
      );

      console.log("Project requests API response:", response.data);

      if (response.data.success) {
        const requestsData = response.data.contacts || response.data.data || [];
        setRequests(requestsData);
        console.log(
          "Project requests loaded successfully:",
          requestsData.length
        );
      } else {
        throw new Error(
          response.data.message || "Error fetching project requests"
        );
      }
    } catch (error) {
      console.error("Error fetching project requests:", error);
      console.error("Error response:", error.response?.data);
      toast.error(
        "Failed to fetch project requests: " +
          (error.response?.data?.message || error.message)
      );

      if (error.response?.status === 403 || error.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate, url]);

  // Fetch statistics
  const fetchStats = useCallback(async () => {
    try {
      const adminAuth = JSON.parse(localStorage.getItem("adminAuth"));
      if (!adminAuth || !adminAuth.email) return;

      const response = await axios.get(`${url}/api/contact/stats`, {
        headers: {
          "admin-email": adminAuth.email,
        },
      });

      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }, [url]);

  useEffect(() => {
    fetchRequests();
    fetchStats();
  }, [fetchRequests, fetchStats]);

  // Update request status
  const updateRequestStatus = async (requestId, status, priority, notes) => {
    try {
      const adminAuth = JSON.parse(localStorage.getItem("adminAuth"));
      if (!adminAuth || !adminAuth.email) {
        throw new Error("Admin authentication required");
      }

      const updateData = { status };
      if (priority) updateData.priority = priority;
      if (notes) updateData.notes = notes;

      const response = await axios.put(
        `${url}/api/contact/${requestId}`,
        updateData,
        {
          headers: {
            "admin-email": adminAuth.email,
          },
        }
      );

      if (response.data.success) {
        toast.success("Request updated successfully");
        fetchRequests();
        fetchStats();
      } else {
        throw new Error(response.data.message || "Error updating request");
      }
    } catch (error) {
      console.error("Error updating request:", error);
      toast.error(error.message || "Failed to update request");
    }
  };

  // Delete request
  const deleteRequest = async (requestId) => {
    try {
      setIsDeleting(true);
      const adminAuth = JSON.parse(localStorage.getItem("adminAuth"));
      if (!adminAuth || !adminAuth.email) {
        throw new Error("Admin authentication required");
      }

      const response = await axios.delete(`${url}/api/contact/${requestId}`, {
        headers: {
          "admin-email": adminAuth.email,
        },
      });

      if (response.data.success) {
        await fetchRequests();
        toast.success("Request deleted successfully");
        setDeleteModal({ show: false, requestId: null });
      } else {
        toast.error("Failed to delete request");
      }
    } catch (error) {
      console.error("Error deleting request:", error);
      toast.error(error.message || "Failed to delete request");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteClick = (requestId) => {
    setDeleteModal({ show: true, requestId });
  };

  const handleDeleteConfirm = () => {
    if (deleteModal.requestId) {
      deleteRequest(deleteModal.requestId);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ show: false, requestId: null });
  };

  // Download file
  const downloadFile = async (requestId, fileIndex, originalName) => {
    try {
      const adminAuth = JSON.parse(localStorage.getItem("adminAuth"));
      if (!adminAuth || !adminAuth.email) {
        throw new Error("Admin authentication required");
      }

      const response = await axios.get(
        `${url}/api/contact/${requestId}/file/${fileIndex}`,
        {
          headers: {
            "admin-email": adminAuth.email,
          },
          responseType: "blob",
        }
      );

      // Get the content type from response headers
      const contentType =
        response.headers["content-type"] || "application/octet-stream";

      // Create blob with proper content type
      const blob = new Blob([response.data], { type: contentType });
      const url_file = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url_file;
      link.setAttribute("download", originalName || `file_${fileIndex}`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Clean up the object URL
      window.URL.revokeObjectURL(url_file);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Failed to download file. Please try again.");
    }
  };

  // Filter and sort requests
  const filteredRequests = () => {
    let filtered = [...requests];

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (request) =>
          request.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          request.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          request.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (request.phone && request.phone.includes(searchQuery))
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((request) => request.status === statusFilter);
    }

    // Apply service filter
    if (serviceFilter !== "all") {
      filtered = filtered.filter(
        (request) => request.service === serviceFilter
      );
    }

    // Apply priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter(
        (request) => request.priority === priorityFilter
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const dateA = new Date(a.submittedAt);
      const dateB = new Date(b.submittedAt);
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  };

  // Helper functions
  const getStatusIcon = (status) => {
    switch (status) {
      case "new":
        return <FaClock className="status-icon new" />;
      case "in-progress":
        return <FaEdit className="status-icon in-progress" />;
      case "contacted":
        return <FaPhone className="status-icon contacted" />;
      case "converted":
        return <FaCheckCircle className="status-icon converted" />;
      case "closed":
        return <FaTimesCircle className="status-icon closed" />;
      default:
        return <FaClock className="status-icon" />;
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "urgent":
        return <FaExclamationTriangle className="priority-icon urgent" />;
      case "high":
        return <FaExclamationTriangle className="priority-icon high" />;
      case "medium":
        return <FaExclamationTriangle className="priority-icon medium" />;
      case "low":
        return <FaExclamationTriangle className="priority-icon low" />;
      default:
        return <FaExclamationTriangle className="priority-icon medium" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const openWhatsApp = (phone, name) => {
    const text = `Hello ${name}, Thank you for your project request! We'll get back to you soon.`;
    const whatsappUrl = `https://wa.me/${phone.replace(
      /[^0-9]/g,
      ""
    )}?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank");
  };

  const openEmail = (email, name, service) => {
    const subject = `Re: Your ${service} Project Request`;
    const body = `Dear ${name},\n\nThank you for your project request. We have received your inquiry about ${service} and will get back to you shortly.\n\nBest regards,\nValix Digital Team`;
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl);
  };

  const toggleExpanded = (requestId) => {
    setExpandedRequest(expandedRequest === requestId ? null : requestId);
  };

  const openModal = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedRequest(null);
    setShowModal(false);
  };

  if (loading) {
    return (
      <div className="project-requests-loading">
        <div className="loading-spinner"></div>
        <p>Loading project requests...</p>
      </div>
    );
  }

  return (
    <div className="project-requests">
      <div className="project-requests-header">
        <div className="header-left">
          <h1>Project Requests</h1>
          <p className="total-count">
            {filteredRequests().length} requests found
          </p>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="stats-cards">
            <div className="stat-card">
              <div className="stat-number">
                {stats.statusStats.find((s) => s._id === "new")?.count || 0}
              </div>
              <div className="stat-label">New</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">
                {stats.statusStats.find((s) => s._id === "in-progress")
                  ?.count || 0}
              </div>
              <div className="stat-label">In Progress</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">
                {stats.statusStats.find((s) => s._id === "converted")?.count ||
                  0}
              </div>
              <div className="stat-label">Converted</div>
            </div>
          </div>
        )}
      </div>

      {/* Filters and Search */}
      <div className="filters-section">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, email, service, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filters-row">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="in-progress">In Progress</option>
            <option value="contacted">Contacted</option>
            <option value="converted">Converted</option>
            <option value="closed">Closed</option>
          </select>

          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Services</option>
            <option value="Web Development">Web Development</option>
            <option value="Mobile App Development">
              Mobile App Development
            </option>
            <option value="Graphic Design">Graphic Design</option>
            <option value="Video Editing">Video Editing</option>
            <option value="Social Media Management">
              Social Media Management
            </option>
            <option value="Complete Package">Complete Package</option>
            <option value="Other">Other</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <button
            onClick={() =>
              setSortOrder(sortOrder === "newest" ? "oldest" : "newest")
            }
            className="sort-btn"
          >
            {sortOrder === "newest" ? <FaSortAmountDown /> : <FaSortAmountUp />}
            {sortOrder === "newest" ? "Newest First" : "Oldest First"}
          </button>
        </div>
      </div>

      {/* Requests Table */}
      <div className="requests-table-container">
        {filteredRequests().length === 0 ? (
          <div className="no-requests">
            <FaFileAlt className="no-requests-icon" />
            <h3>No Project Requests Found</h3>
            <p>No requests match your current filters.</p>
          </div>
        ) : (
          <div className="requests-table">
            {filteredRequests().map((request) => (
              <div
                key={request._id}
                className={`request-card ${request.status}`}
              >
                <div
                  className="request-header"
                  onClick={() => toggleExpanded(request._id)}
                >
                  <div className="request-basic-info">
                    <div className="request-title">
                      <div className="client-info">
                        <FaUser className="client-icon" />
                        <span className="client-name">{request.name}</span>
                      </div>
                      <div className="service-badge">
                        <FaTags className="service-icon" />
                        {request.service}
                      </div>
                    </div>

                    <div className="request-meta">
                      <div className="status-priority">
                        {getStatusIcon(request.status)}
                        <span className={`status-text ${request.status}`}>
                          {request.status.replace("-", " ").toUpperCase()}
                        </span>
                        {getPriorityIcon(request.priority)}
                        <span className={`priority-text ${request.priority}`}>
                          {request.priority.toUpperCase()}
                        </span>
                      </div>

                      <div className="request-date">
                        <FaCalendarAlt className="date-icon" />
                        {formatDate(request.submittedAt)}
                      </div>
                    </div>
                  </div>

                  <div className="request-actions-preview">
                    <div className="budget-info">
                      {request.budget && (
                        <div className="budget-badge">
                          <FaRupeeSign className="budget-icon" />
                          {request.budget}
                        </div>
                      )}
                    </div>

                    <div className="expand-icon">
                      {expandedRequest === request._id ? (
                        <FaChevronUp />
                      ) : (
                        <FaChevronDown />
                      )}
                    </div>
                  </div>
                </div>

                {expandedRequest === request._id && (
                  <div className="request-details">
                    <div className="details-grid">
                      <div className="contact-details">
                        <h4>Contact Information</h4>
                        <div className="contact-item">
                          <FaEnvelope className="contact-icon" />
                          <span>{request.email}</span>
                        </div>
                        {request.phone && (
                          <div className="contact-item">
                            <FaPhone className="contact-icon" />
                            <span>{request.phone}</span>
                          </div>
                        )}
                      </div>

                      <div className="project-details">
                        <h4>Project Details</h4>
                        <div className="detail-item">
                          <strong>Service:</strong> {request.service}
                        </div>
                        {request.budget && (
                          <div className="detail-item">
                            <strong>Budget:</strong> {request.budget}
                          </div>
                        )}
                        {request.estimatedValue > 0 && (
                          <div className="detail-item">
                            <strong>Estimated Value:</strong> ₹
                            {request.estimatedValue.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="message-section">
                      <h4>Project Description</h4>
                      <div className="message-content">{request.message}</div>
                    </div>

                    {request.files && request.files.length > 0 && (
                      <div className="files-section">
                        <h4>Attached Files</h4>
                        <div className="files-list">
                          {request.files.map((file, index) => (
                            <div key={index} className="file-item">
                              <FaFileAlt className="file-icon" />
                              <span className="file-name">
                                {file.originalName}
                              </span>
                              <button
                                onClick={() =>
                                  downloadFile(
                                    request._id,
                                    index,
                                    file.originalName
                                  )
                                }
                                className="download-btn"
                              >
                                <FaDownload />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {request.notes && request.notes.length > 0 && (
                      <div className="notes-section">
                        <h4>Internal Notes</h4>
                        <div className="notes-list">
                          {request.notes.map((note, index) => (
                            <div key={index} className="note-item">
                              <div className="note-header">
                                <span className="note-author">
                                  {note.addedBy}
                                </span>
                                <span className="note-date">
                                  {formatDate(note.addedAt)}
                                </span>
                              </div>
                              <div className="note-content">{note.note}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="request-actions">
                      <div className="action-buttons">
                        <button
                          onClick={() =>
                            openWhatsApp(request.phone, request.name)
                          }
                          className="action-btn whatsapp"
                          disabled={!request.phone}
                        >
                          <FaWhatsapp />
                          WhatsApp
                        </button>

                        <button
                          onClick={() =>
                            openEmail(
                              request.email,
                              request.name,
                              request.service
                            )
                          }
                          className="action-btn email"
                        >
                          <FaEnvelope />
                          Email
                        </button>

                        <button
                          onClick={() => openModal(request)}
                          className="action-btn edit"
                        >
                          <FaEdit />
                          Update
                        </button>

                        <button
                          onClick={() => handleDeleteClick(request._id)}
                          className="action-btn delete"
                          disabled={isDeleting}
                        >
                          <FaTrash />
                          Delete
                        </button>
                      </div>

                      <div className="status-actions">
                        <select
                          value={request.status}
                          onChange={(e) =>
                            updateRequestStatus(request._id, e.target.value)
                          }
                          className="status-select"
                        >
                          <option value="new">New</option>
                          <option value="in-progress">In Progress</option>
                          <option value="contacted">Contacted</option>
                          <option value="converted">Converted</option>
                          <option value="closed">Closed</option>
                        </select>

                        <select
                          value={request.priority}
                          onChange={(e) =>
                            updateRequestStatus(
                              request._id,
                              request.status,
                              e.target.value
                            )
                          }
                          className="priority-select"
                        >
                          <option value="low">Low Priority</option>
                          <option value="medium">Medium Priority</option>
                          <option value="high">High Priority</option>
                          <option value="urgent">Urgent</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for detailed view/edit */}
      {showModal && selectedRequest && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Project Request Details</h2>
              <button onClick={closeModal} className="close-btn">
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="request-full-details">
                <div className="client-section">
                  <h3>{selectedRequest.name}</h3>
                  <p>
                    <strong>Email:</strong> {selectedRequest.email}
                  </p>
                  {selectedRequest.phone && (
                    <p>
                      <strong>Phone:</strong> {selectedRequest.phone}
                    </p>
                  )}
                  <p>
                    <strong>Service:</strong> {selectedRequest.service}
                  </p>
                  {selectedRequest.budget && (
                    <p>
                      <strong>Budget:</strong> {selectedRequest.budget}
                    </p>
                  )}
                  <p>
                    <strong>Submitted:</strong>{" "}
                    {formatDate(selectedRequest.submittedAt)}
                  </p>
                </div>

                <div className="message-full">
                  <h4>Project Description</h4>
                  <div className="message-text">{selectedRequest.message}</div>
                </div>

                {selectedRequest.files && selectedRequest.files.length > 0 && (
                  <div className="files-full">
                    <h4>Attached Files</h4>
                    {selectedRequest.files.map((file, index) => (
                      <div key={index} className="file-item">
                        <span>{file.originalName}</span>
                        <button
                          onClick={() =>
                            downloadFile(
                              selectedRequest._id,
                              index,
                              file.originalName
                            )
                          }
                        >
                          <FaDownload /> Download
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="modal-overlay" onClick={handleDeleteCancel}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <FaExclamationTriangle className="warning-icon" />
              <h3>Delete Request</h3>
            </div>
            <div className="modal-body">
              <p>
                Are you sure you want to delete this project request? This
                action cannot be undone.
              </p>
              <div className="modal-actions">
                <button
                  className="modal-btn cancel"
                  onClick={handleDeleteCancel}
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  className="modal-btn confirm"
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectRequests;
