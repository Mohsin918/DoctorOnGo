import { useState } from "react";
import Modal from "react-modal";

// Define the type for the props
interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (password: string) => void;
  isNewPatient: boolean;
}

const PasswordModal: React.FC<PasswordModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isNewPatient,
}) => {
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSubmit = () => {
    if (isNewPatient && password !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }
    onSubmit(password); // Pass the password back to the parent component
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={{
        overlay: {
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
        content: {
          backgroundColor: "#ffffff",
          padding: "20px",
          borderRadius: "10px",
          maxWidth: "400px",
          width: "100%",
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
          textAlign: "center",
          animation: "slide-down 0.3s ease-out",
          inset: "auto", // Ensure modal is centered
        },
      }}
    >
      <div>
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "600",
            marginBottom: "10px",
            color: "#333",
          }}
        >
          {isNewPatient ? "Create Your Password" : "Enter Your Password"}
        </h2>
        <p style={{ fontSize: "1rem", marginBottom: "20px", color: "#666" }}>
          {isNewPatient
            ? "Please create a strong password and confirm it."
            : "Please enter your password to proceed."}
        </p>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          style={{
            width: "100%",
            padding: "10px",
            fontSize: "1rem",
            marginBottom: "20px",
            border: "1px solid #ddd",
            borderRadius: "5px",
            transition: "border-color 0.3s ease",
            outline: "none",
          }}
        />

        {isNewPatient && (
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "1rem",
              marginBottom: "20px",
              border: "1px solid #ddd",
              borderRadius: "5px",
              transition: "border-color 0.3s ease",
              outline: "none",
            }}
          />
        )}

        {errorMessage && (
          <p
            style={{
              color: "#e74c3c",
              fontSize: "0.9rem",
              marginBottom: "15px",
            }}
          >
            {errorMessage}
          </p>
        )}

        <div style={{ marginTop: "20px" }}>
          <button
            onClick={handleSubmit}
            style={{
              backgroundColor: "#3498db",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              fontSize: "1rem",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#2980b9")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#3498db")
            }
          >
            {isNewPatient ? "Create Password" : "Submit"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PasswordModal;
