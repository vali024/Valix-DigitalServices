import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FaPlus, FaTimes, FaLink } from "react-icons/fa";
import "./EditPortfolio.css";

const EditPortfolio = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
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
  const [currentMedia, setCurrentMedia] = useState("");
  
  const apiUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  const apiBaseUrl = `${apiUrl}/api`;
  const adminAuth = JSON.parse(localStorage.getItem("adminAuth"));
  const adminEmail = adminAuth?.email;

  useEffect(() => {
    fetchPortfolioItem();
  }, [id]);

  const fetchPortfolioItem = async () => {
    try {
      setFetchingData(true);
      const response = await axios.get(`${apiBaseUrl}/portfolio/${id}`);
      const portfolioData = response.data.data;
      
      setFormData({
        title: portfolioData.title,
        category: portfolioData.category,
        type: portfolioData.type,
        description: portfolioData.description,
        client: portfolioData.client,
        result: portfolioData.result,
        websiteUrl: portfolioData.websiteUrl || "",
        tags: portfolioData.tags.length > 0 ? portfolioData.tags : [""],
        featured: portfolioData.featured || false,
        socialLinks: {
          instagram: portfolioData.socialLinks?.instagram || "",
          linkedin: portfolioData.socialLinks?.linkedin || "",
          facebook: portfolioData.socialLinks?.facebook || "",
          twitter: portfolioData.socialLinks?.twitter || "",
          youtube: portfolioData.socialLinks?.youtube || "",
        },
      });
      
      setCurrentMedia(portfolioData.image);
      setMediaPreview(`${apiUrl}${portfolioData.image}`);
      setMediaType(portfolioData.mediaType || "image");
      
      setFetchingData(false);
    } catch (error) {
      toast.error("Failed to fetch portfolio item");
      console.error("Error fetching portfolio item:", error);
      setFetchingData(false);
      navigate("/portfolio");
    }
  };

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
        return;
      }

      setMediaFile(file);
      
      // Reset current media
      setCurrentMedia("");
      
      // Determine file type
      const fileType = file.type.split('/')[0];
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
    // If we had a saved media, just remove the new one
    if (currentMedia && !mediaFile) {
      toast.error("At least one image or video is required");
      return;
    }
    
    setMediaPreview(null);
    setMediaFile(null);
    setCurrentMedia("");
    document.getElementById('mediaUpload').value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!mediaPreview) {
      toast.error("Please select an image or video");
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
      data.append('mediaType', mediaType);
      
      // Only append new media if it was changed
      if (mediaFile) {
        data.append('image', mediaFile);
      }

      await axios.put(`${apiBaseUrl}/portfolio/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'admin-email': adminEmail
        }
      });

      toast.success("Portfolio item updated successfully");
      navigate("/portfolio");
    } catch (error) {
      console.error("Error updating portfolio item:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to update portfolio item");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingData) {
    return (
      <div className="edit-loading-container">
        <div className="edit-loading-spinner"></div>
        <p>Loading project data...</p>
      </div>
    );
  }

  return (
    <div className="edit-portfolio-container">
      <div className="edit-portfolio-header">
        <h2>Edit Portfolio Project</h2>
        <button className="edit-back-btn" onClick={() => navigate("/portfolio")}>
          Back to Portfolio
        </button>
      </div>

      <form onSubmit={handleSubmit} className="edit-portfolio-form">
        <div className="edit-form-grid">
          {/* Left column - Basic Information */}
          <div className="edit-form-column">
            <div className="edit-form-section">
              <h3>Basic Information</h3>
              
              <div className="edit-form-group">
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

              <div className="edit-form-group">
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

              <div className="edit-form-group">
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

              <div className="edit-form-group">
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

              <div className="edit-form-group">
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

              <div className="edit-form-group edit-checkbox-group">
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

            <div className="edit-form-section">
              <h3>Project Description</h3>
              
              <div className="edit-form-group">
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

              <div className="edit-form-group">
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
          <div className="edit-form-column">
            <div className="edit-form-section">
              <h3>Project Media</h3>
              
              <div className="edit-form-group">
                <label>Project Media* (Image or Video)</label>
                <div className="edit-media-upload-container">
                  <div 
                    className={`edit-media-upload-area ${mediaPreview ? 'has-preview' : ''}`}
                    onClick={() => document.getElementById('mediaUpload').click()}
                  >
                    {mediaPreview ? (
                      mediaType === 'image' ? (
                        <img 
                          src={mediaPreview} 
                          alt="Preview" 
                          className="edit-media-preview" 
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                          }}
                        />
                      ) : (
                        <video 
                          src={mediaPreview} 
                          className="edit-media-preview" 
                          controls
                          onError={(e) => {
                            console.error("Video error:", e);
                            e.target.src = 'https://via.placeholder.com/300x200?text=Video+Preview+Failed';
                          }}
                        />
                      )
                    ) : (
                      <div className="edit-upload-placeholder">
                        <FaPlus />
                        <p>Click to upload image or video</p>
                        <span className="edit-upload-formats">Supported formats: JPG, PNG, MP4, WebM</span>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    id="mediaUpload"
                    onChange={handleMediaChange}
                    accept="image/*,video/*"
                    className="edit-hidden-input"
                  />
                  {mediaPreview && (
                    <button 
                      type="button" 
                      className="edit-remove-media-btn"
                      onClick={removeMedia}
                    >
                      Replace {mediaType === 'image' ? 'Image' : 'Video'}
                    </button>
                  )}
                </div>
                <p className="edit-input-help">
                  {mediaType === 'image' 
                    ? "Recommended image size: 1200x800px, max 50MB" 
                    : mediaType === 'video' 
                      ? "Recommended video resolution: 1080p, max 50MB" 
                      : "Image recommended size: 1200x800px, Video recommended resolution: 1080p, max 50MB"}
                </p>
              </div>
            </div>

            <div className="edit-form-section">
              <h3>Tags</h3>
              <p className="edit-section-desc">Add tags to help categorize and find your project</p>
              
              <div className="edit-tags-container">
                {formData.tags.map((tag, index) => (
                  <div className="edit-tag-input-group" key={index}>
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => handleTagChange(index, e.target.value)}
                      placeholder="Enter tag"
                    />
                    <button
                      type="button"
                      className="edit-remove-tag-btn"
                      onClick={() => removeTag(index)}
                      disabled={formData.tags.length === 1}
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="edit-add-tag-btn"
                  onClick={addTag}
                >
                  <FaPlus /> Add Tag
                </button>
              </div>
            </div>

            <div className="edit-form-section">
              <h3>Social Media Links</h3>
              <p className="edit-section-desc">Add relevant social media links (optional)</p>
              
              <div className="edit-social-links-container">
                <div className="edit-social-link-group">
                  <div className="edit-social-icon instagram">
                    <FaLink />
                  </div>
                  <input
                    type="url"
                    placeholder="Instagram URL"
                    value={formData.socialLinks.instagram}
                    onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                  />
                </div>
                
                <div className="edit-social-link-group">
                  <div className="edit-social-icon linkedin">
                    <FaLink />
                  </div>
                  <input
                    type="url"
                    placeholder="LinkedIn URL"
                    value={formData.socialLinks.linkedin}
                    onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                  />
                </div>
                
                <div className="edit-social-link-group">
                  <div className="edit-social-icon facebook">
                    <FaLink />
                  </div>
                  <input
                    type="url"
                    placeholder="Facebook URL"
                    value={formData.socialLinks.facebook}
                    onChange={(e) => handleSocialLinkChange('facebook', e.target.value)}
                  />
                </div>
                
                <div className="edit-social-link-group">
                  <div className="edit-social-icon twitter">
                    <FaLink />
                  </div>
                  <input
                    type="url"
                    placeholder="Twitter URL"
                    value={formData.socialLinks.twitter}
                    onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                  />
                </div>
                
                <div className="edit-social-link-group">
                  <div className="edit-social-icon youtube">
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

        <div className="edit-form-actions">
          <button
            type="button"
            className="edit-cancel-btn"
            onClick={() => navigate("/portfolio")}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="edit-submit-btn"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Project"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPortfolio;
