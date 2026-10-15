
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import {
  FiUploadCloud,
  FiDownload,
  FiImage,
  FiShield,
  FiZap,
  FiCheckCircle,
  FiArrowRight,
  FiX,
  FiRefreshCw,
  FiStar,
} from "react-icons/fi";
import "./App.css";

export default function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [converted, setConverted] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);

  const inputRef = useRef(null);
  const previewUrlRef = useRef("");
  const convertedUrlRef = useRef("");

  // Entrance animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-eyebrow", {
        opacity: 0,
        y: 12,
        duration: 0.5,
      });

      gsap.from(".hero-title", {
        opacity: 0,
        y: 25,
        duration: 0.7,
        delay: 0.1,
        ease: "power3.out",
      });

      gsap.from(".hero-description, .hero-actions", {
        opacity: 0,
        y: 15,
        duration: 0.5,
        stagger: 0.12,
        delay: 0.2,
      });

      gsap.from(".converter-card", {
        opacity: 0,
        y: 20,
        duration: 0.7,
        delay: 0.2,
        ease: "power2.out",
      });

      gsap.from(".benefit-card", {
        opacity: 0,
        y: 18,
        duration: 0.5,
        stagger: 0.12,
        delay: 0.35,
      });
    });

    return () => ctx.revert();
  }, []);

  // Clean up generated URLs when the component unmounts
  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }

      if (convertedUrlRef.current) {
        URL.revokeObjectURL(convertedUrlRef.current);
      }
    };
  }, []);

  function updatePreview(url) {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }

    previewUrlRef.current = url;
    setPreview(url);
  }

  function updateConverted(url) {
    if (convertedUrlRef.current) {
      URL.revokeObjectURL(convertedUrlRef.current);
    }

    convertedUrlRef.current = url;
    setConverted(url);
  }

  // Validate the uploaded WebP file
  function handleFile(selectedFile) {
    setError("");

    if (!selectedFile) return;

    const validWebP =
      selectedFile.type === "image/webp" ||
      /\.webp$/i.test(selectedFile.name);

    if (!validWebP) {
      setError("Please upload an image in WebP format.");
      return;
    }

    if (selectedFile.size === 0) {
      setError("The selected file is empty.");
      return;
    }

    if (selectedFile.size > 20 * 1024 * 1024) {
      setError("File size must be less than 20 MB.");
      return;
    }

    setFile(selectedFile);
    updateConverted("");
    updatePreview(URL.createObjectURL(selectedFile));
  }

  // Convert WebP to PNG in the browser
  function convertImage() {
    if (!file || !preview || loading) return;

    setLoading(true);
    setError("");
    updateConverted("");

    const image = new Image();

    image.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;

        const context = canvas.getContext("2d");

        if (!context) {
          throw new Error("Canvas is unavailable.");
        }

        context.drawImage(image, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              setError("Conversion failed. Please try again.");
              setLoading(false);
              return;
            }

            updateConverted(URL.createObjectURL(blob));
            setLoading(false);
          },
          "image/png"
        );
      } catch {
        setError("Unable to convert this image. Please try again.");
        setLoading(false);
      }
    };

    image.onerror = () => {
      setError("Unable to read this image. Please select another file.");
      setLoading(false);
    };

    image.src = preview;
  }

  // Download the converted image
  function downloadImage() {
    if (!converted || !file) return;

    const link = document.createElement("a");
    link.href = converted;
    link.download = file.name.replace(/\.webp$/i, "") + ".png";

    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  // Clear the converter
  function resetConverter() {
    setFile(null);
    updatePreview("");
    updateConverted("");
    setError("");
    setLoading(false);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function formatSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <div className="app-shell">
      {/* Navigation */}
      <header className="navbar">
        <a href="#" className="brand">
          <span className="brand-mark">
            <FiImage size={23} />
          </span>
          PixelConvert
        </a>

        <nav className="nav-links">
          <a href="#converter">Converter</a>
          <a href="#features">Features</a>
          <a href="#about">About</a>

          <button
            className="nav-cta"
            onClick={() => scrollTo("converter")}
          >
            Get Started <FiArrowRight />
          </button>
        </nav>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="hero-eyebrow">
          <FiStar />
          SIMPLE. FAST. FREE.
        </div>

        <h1 className="hero-title">
          Convert Images.
          <br />
          <span>Keep It Simple.</span>
        </h1>

        <p className="hero-description">
          Transform your WebP images into high-quality PNG files
          in seconds. No complicated software, no account required.
          Just upload, convert, and download.
        </p>

        <div className="hero-actions">
          <button
            className="primary-button"
            onClick={() => scrollTo("converter")}
          >
            Convert Your Image <FiArrowRight />
          </button>

          <button
            className="secondary-button"
            onClick={() => scrollTo("features")}
          >
            Explore Features
          </button>
        </div>
      </section>

      {/* Main converter */}
      <section className="workspace" id="converter">
        <div className="converter-card">
          <div className="upload-panel">
            <h2 className="section-heading">Upload your image</h2>

            <p className="section-description">
              Choose a WebP file from your device to get started.
            </p>

            <div
              className={`dropzone ${dragging ? "dragging" : ""}`}
              onDragOver={(event) => {
                event.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(event) => {
                event.preventDefault();
                setDragging(false);
                handleFile(event.dataTransfer.files?.[0]);
              }}
            >
              <div className="upload-icon">
                <FiUploadCloud size={32} />
              </div>

              <h3>Drop your image here</h3>
              <p>or browse files from your computer</p>

              <input
                ref={inputRef}
                className="file-input"
                type="file"
                accept=".webp,image/webp"
                onChange={(event) => {
                  handleFile(event.target.files?.[0]);
                  event.target.value = "";
                }}
              />

              <button
                type="button"
                className="choose-button"
                onClick={() => inputRef.current?.click()}
              >
                <FiUploadCloud size={17} />
                Choose WebP File
              </button>

              <span className="file-limit">
                WEBP FORMAT · MAXIMUM 20 MB
              </span>
            </div>

            {error && (
              <p className="error-message" role="alert">
                {error}
              </p>
            )}
          </div>

          <div className="preview-panel">
            <div className="preview-heading">
              <h2 className="section-heading">Image preview</h2>

              <span className="format-pill">
                {converted ? (
                  <>
                    <FiCheckCircle /> PNG READY
                  </>
                ) : (
                  <>
                    <FiImage /> WEBP → PNG
                  </>
                )}
              </span>
            </div>

            <p className="section-description">
              Preview your image before downloading the result.
            </p>

            <div className="preview-box">
              {preview ? (
                <img
                  src={converted || preview}
                  alt={converted ? "Converted PNG" : "Original WebP"}
                />
              ) : (
                <div className="empty-preview">
                  <FiImage size={45} />
                  <p>
                    Your image will appear here
                    <br />
                    once you upload a file.
                  </p>
                </div>
              )}
            </div>

            {file && (
              <div className="file-details">
                <span>
                  {file.name}
                  <br />
                  {formatSize(file.size)}
                </span>

                <button
                  className="remove-button"
                  onClick={resetConverter}
                >
                  <FiX /> Remove
                </button>
              </div>
            )}

            {converted && (
              <div className="success-message" role="status">
                <FiCheckCircle size={19} />
                <span>
                  <strong>Conversion successful!</strong>
                  <br />
                  Your PNG is ready to download.
                </span>
              </div>
            )}

            {converted ? (
              <button
                className="primary-button convert-button"
                onClick={downloadImage}
              >
                <FiDownload size={18} />
                Download PNG
              </button>
            ) : (
              <button
                className="primary-button convert-button"
                onClick={convertImage}
                disabled={!file || loading}
              >
                {loading ? (
                  <>
                    <FiRefreshCw className="spin" />
                    Converting...
                  </>
                ) : (
                  <>
                    <FiZap />
                    Convert to PNG
                    <FiArrowRight />
                  </>
                )}
              </button>
            )}

            {converted && (
              <button
                className="secondary-button convert-button"
                onClick={resetConverter}
              >
                Convert Another Image
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="benefits" id="features">
        <div className="benefits-header">
          <div className="hero-eyebrow">
            <FiStar />
            WHY PIXELCONVERT
          </div>

          <h2>Everything you need. Nothing you don't.</h2>

          <p>
            A straightforward image conversion experience
            designed for everyday use.
          </p>
        </div>

        <div className="benefit-grid">
          <article className="benefit-card">
            <div className="benefit-icon">
              <FiZap size={23} />
            </div>
            <h3>Fast Conversion</h3>
            <p>
              Convert images in seconds using your browser's
              built-in image processing capabilities.
            </p>
          </article>

          <article className="benefit-card">
            <div className="benefit-icon">
              <FiShield size={23} />
            </div>
            <h3>Privacy First</h3>
            <p>
              Images are processed locally in your browser,
              without uploading them to a conversion server.
            </p>
          </article>

          <article className="benefit-card">
            <div className="benefit-icon">
              <FiDownload size={23} />
            </div>
            <h3>High-Quality PNG</h3>
            <p>
              Export PNG images with lossless encoding and
              support for transparent backgrounds.
            </p>
          </article>
        </div>

        <p className="trust-note" id="about">
          <FiShield />
          Free to use · No registration · Browser-based conversion
        </p>
      </section>

      {/* Footer */}
      <footer className="footer">
        <span className="footer-brand">PixelConvert.</span>
        <span>Simple tools for your everyday workflow.</span>
        <span className="footer-note">
          <FiStar /> Made for creators
        </span>
      </footer>
    </div>
  );
}
