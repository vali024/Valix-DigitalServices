import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaPlus, FaTimes, FaLink } from "react-icons/fa";
import "./AddPortfolio.css";

const AddPortfolio = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "Web",
    type: "website",
    description: "",
    client: "",
    result: "",
    websiteUrl: "",
    tags: [""],
    featured: false,
    socialLinks: {
      instagram: "",
      linkedin: "",
      facebook: "",
      twitter: "",
      youtube: "",
    },
  });
  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaType, setMediaType] = useState(null); // 'image' or 'video'
  
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";
  const adminAuth = JSON.parse(localStorage.getItem("adminAuth"));
  const adminEmail = adminAuth?.email;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSocialLinkChange = (platform, value) => {
    setFormData({
      ...formData,
      socialLinks: {
        ...formData.socialLinks,
        [platform]: value,
      },
    });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
  };

  const handleTagChange = (index, value) => {
    const newTags = [...formData.tags];
    newTags[index] = value;
    setFormData({ ...formData, tags: newTags });
  };

  const addTag = () => {
    setFormData({ ...formData, tags: [...formData.tags, ""] });
  };

  const removeTag = (index) => {
    const newTags = formData.tags.filter((_, i) => i !== index);
    // Make sure we always have at least one tag field
    if (newTags.length === 0) {
      newTags.push("");
    }
    setFormData({ ...formData, tags: newTags });
  };

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (50MB = 50 * 1024 * 1024 bytes)
      if (file.size > 50 * 1024 * 1024) {
        toast.error("File is too large. Maximum size is 50MB");
        e.target.value = ''; // Clear the input
        return;
      }

      // Check file type
      const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      const allowedVideoTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/webm', 'video/quicktime'];
      const allAllowedTypes = [...allowedImageTypes, ...allowedVideoTypes];
      
      if (!allAllowedTypes.includes(file.type)) {
        toast.error("Invalid file type. Please upload an image (JPEG, PNG, WebP, GIF) or video (MP4, AVI, MOV, WMV, WebM)");
        e.target.value = ''; // Clear the input
        return;
      }

      setMediaFile(file);
      
      // Determine file type
      const fileType = allowedVideoTypes.includes(file.type) ? 'video' : 'image';
      setMediaType(fileType);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeMedia = () => {
    setMediaPreview(null);
    setMediaFile(null);
    setMediaType(null);
    document.getElementById('mediaUpload').value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!mediaFile) {
      toast.error("Please select an image or video file");
      return;
    }

    // Filter out empty tags
    const filteredTags = formData.tags.filter(tag => tag.trim() !== "");
    if (filteredTags.length === 0) {
      toast.error("Please add at least one tag");
      return;
    }

    try {
      setLoading(true);
      
      // Create form data for file upload
      const data = new FormData();
      data.append('title', formData.title);
      data.append('category', formData.category);
      data.append('type', formData.type);
      data.append('description', formData.description);
      data.append('client', formData.client);
      data.append('result', formData.result);
      data.append('websiteUrl', formData.websiteUrl);
      data.append('featured', formData.featured);
      data.append('tags', JSON.stringify(filteredTags));
      data.append('socialLinks', JSON.stringify(formData.socialLinks));
      data.append('image', mediaFile); // Backend handles both image and video
      data.append('mediaType', mediaType);

      await axios.post(`${apiBaseUrl}/portfolio`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'admin-email': adminEmail
        },
        timeout: 120000, // 2 minutes timeout for large files
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Upload Progress: ${percentCompleted}%`);
        }
      });

      toast.success("Portfolio item created successfully");
      navigate("/portfolio");
    } catch (error) {
      console.error("Error creating portfolio item:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to create portfolio item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-portfolio-container">
      <div className="add-portfolio-header">
        <h2>Add New Portfolio Project</h2>
        <button className="back-btn" onClick={() => navigate("/portfolio")}>
          Back to Portfolio
        </button>
      </div>

      <form onSubmit={handleSubmit} className="portfolio-form">
        <div className="form-grid">
          {/* Left column - Basic Information */}
          <div className="form-column">
            <div className="form-section">
              <h3>Basic Information</h3>
              
              <div className="form-group">
                <label htmlFor="title">Project Title*</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter project title"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category*</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="Web">Web</option>
                  <option value="Design">Design</option>
                  <option value="Video">Video</option>
                  <option value="Social">Social</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="type">Project Type*</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                >
                  <option value="website">Website</option>
                  <option value="design">Design</option>
                  <option value="video">Video</option>
                  <option value="social">Social Media</option>
                  <option value="app">Mobile App</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="client">Client Name*</label>
                <input
                  type="text"
                  id="client"
                  name="client"
                  value={formData.client}
                  onChange={handleChange}
                  placeholder="Enter client name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="websiteUrl">Website URL</label>
                <input
                  type="url"
                  id="websiteUrl"
                  name="websiteUrl"
                  value={formData.websiteUrl}
                  onChange={handleChange}
                  placeholder="https://example.com"
                />
              </div>

              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="featured">Featured Project (Show on Home Page)</label>
              </div>
            </div>

            <div className="form-section">
              <h3>Project Description</h3>
              
              <div className="form-group">
                <label htmlFor="description">Description*</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the project"
                  rows="4"
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="result">Result/Achievement*</label>
                <textarea
                  id="result"
                  name="result"
                  value={formData.result}
                  onChange={handleChange}
                  placeholder="Describe the outcome of the project"
                  rows="4"
                  required
                ></textarea>
              </div>
            </div>
          </div>

          {/* Right column - Media, Tags, and Social Links */}
          <div className="form-column">
            <div className="form-section">
              <h3>Project Media</h3>
              
              <div className="form-group">
                <label>Upload Media* (Image or Video)</label>
                <div className="media-upload-container">
                  <div 
                    className={`media-upload-area ${mediaPreview ? 'has-preview' : ''}`}
                    onClick={() => document.getElementById('mediaUpload').click()}
                  >
                    {mediaPreview ? (
                      mediaType === 'image' ? (
                        <img src={mediaPreview} alt="Preview" className="media-preview" />
                      ) : (
                        <video 
                          src={mediaPreview} 
                          className="media-preview" 
                          controls
                          onError={(e) => {
                            console.error("Video error:", e);
                            e.target.src = 'https://via.placeholder.com/300x200?text=Video+Preview+Failed';
                          }}
                        />
                      )
                    ) : (
                      <div className="upload-placeholder">
                        <FaPlus />
                        <p>Click to upload image or video</p>
                        <span className="upload-formats">Supported formats: JPG, PNG, MP4, WebM</span>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    id="mediaUpload"
                    onChange={handleMediaChange}
                    accept="image/*,video/*"
                    className="hidden-input"
                  />
                  {mediaPreview && (
                    <button 
                      type="button" 
                      className="remove-media-btn"
                      onClick={removeMedia}
                    >
                      Remove {mediaType === 'image' ? 'Image' : 'Video'}
                    </button>
                  )}
                </div>
                <p className="input-help">
                  {mediaType === 'image' 
                    ? "Recommended image size: 1200x800px, max 50MB" 
                    : mediaType === 'video' 
                      ? "Recommended video resolution: 1080p, max 50MB" 
                      : "Image recommended size: 1200x800px, Video recommended resolution: 1080p, max 50MB"}
                </p>
              </div>
            </div>

            <div className="form-section">
              <h3>Tags</h3>
              <p className="section-desc">Add tags to help categorize and find your project</p>
              
              <div className="tags-container">
                {formData.tags.map((tag, index) => (
                  <div className="tag-input-group" key={index}>
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => handleTagChange(index, e.target.value)}
                      placeholder="Enter tag"
                    />
                    <button
                      type="button"
                      className="remove-tag-btn"
                      onClick={() => removeTag(index)}
                      disabled={formData.tags.length === 1}
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="add-tag-btn"
                  onClick={addTag}
                >
                  <FaPlus /> Add Tag
                </button>
              </div>
            </div>

            <div className="form-section">
              <h3>Social Media Links</h3>
              <p className="section-desc">Add relevant social media links (optional)</p>
              
              <div className="social-links-container">
                <div className="social-link-group">
                  <div className="social-icon instagram">
                    <FaLink />
                  </div>
                  <input
                    type="url"
                    placeholder="Instagram URL"
                    value={formData.socialLinks.instagram}
                    onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                  />
                </div>
                
                <div className="social-link-group">
                  <div className="social-icon linkedin">
                    <FaLink />
                  </div>
                  <input
                    type="url"
                    placeholder="LinkedIn URL"
                    value={formData.socialLinks.linkedin}
                    onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                  />
                </div>
                
                <div className="social-link-group">
                  <div className="social-icon facebook">
                    <FaLink />
                  </div>
                  <input
                    type="url"
                    placeholder="Facebook URL"
                    value={formData.socialLinks.facebook}
                    onChange={(e) => handleSocialLinkChange('facebook', e.target.value)}
                  />
                </div>
                
                <div className="social-link-group">
                  <div className="social-icon twitter">
                    <FaLink />
                  </div>
                  <input
                    type="url"
                    placeholder="Twitter URL"
                    value={formData.socialLinks.twitter}
                    onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                  />
                </div>
                
                <div className="social-link-group">
                  <div className="social-icon youtube">
                    <FaLink />
                  </div>
                  <input
                    type="url"
                    placeholder="YouTube URL"
                    value={formData.socialLinks.youtube}
                    onChange={(e) => handleSocialLinkChange('youtube', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate("/portfolio")}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Project"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPortfolio;
