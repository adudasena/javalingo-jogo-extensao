import React, { useEffect } from "react";

export default function Toast({ title, message, onClose, variant = "corner" }) {
  useEffect(() => {
    const t = setTimeout(onClose, variant === "center" ? 6000 : 4000); // ⏳ mais tempo pro central
    return () => clearTimeout(t);
  }, [onClose, variant]);

  // estilos básicos
  const baseStyle = {
    zIndex: 999,
    color: "#fff",
    borderRadius: "14px",
    padding: "18px 24px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.45)",
    fontFamily: "Poppins, sans-serif",
    border: "1px solid rgba(255,255,255,0.12)",
    background:
      "linear-gradient(135deg, rgba(60, 20, 90, 0.92), rgba(10, 100, 70, 0.95))",
    backdropFilter: "blur(8px)",
    animation: "toastIn 0.4s ease, toastOut 0.4s ease 3.6s forwards",
  };

  // posicionamento e tamanho conforme variante
  const position =
    variant === "center"
      ? {
          position: "fixed",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -30%)",
          maxWidth: "420px",
          textAlign: "center",
          fontSize: "1.05rem",
          padding: "22px 28px",
        }
      : {
          position: "fixed",
          bottom: 24,
          right: 24,
          maxWidth: "320px",
          fontSize: "0.95rem",
        };

  return (
    <div style={{ ...baseStyle, ...position }}>
      <strong
        style={{
          display: "block",
          marginBottom: "6px",
          color: "#c084fc",
          fontWeight: 600,
          fontSize: "1.1rem",
        }}
      >
        {title}
      </strong>
      <span style={{ opacity: 0.95 }}>{message}</span>

      <style>
        {`
          @keyframes toastIn {
            from { transform: translateY(16px) scale(0.95); opacity: 0; }
            to { transform: translateY(0) scale(1); opacity: 1; }
          }
          @keyframes toastOut {
            from { opacity: 1; transform: translateY(0) scale(1); }
            to { opacity: 0; transform: translateY(8px) scale(0.98); }
          }
        `}
      </style>
    </div>
  );
}
