import React from "react";

interface GoogleButtonProps {
  label?: string;
}

const GoogleButton: React.FC<GoogleButtonProps> = ({ label = "Continue with Google",}) => {

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api/v1";

  return (
    <a
      href={`${API}/auth/google`}
      className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          fill="#4285F4"
          d="M21.35 12.27c0-.72-.06-1.41-.18-2.07H12v3.92h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.24z"
        />
        <path
          fill="#34A853"
          d="M12 21.75c2.63 0 4.84-.87 6.45-2.35l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.75 9.75 0 0 0 12 21.75z"
        />
        <path
          fill="#FBBC05"
          d="M6.54 13.84A5.86 5.86 0 0 1 6.23 12c0-.64.11-1.26.31-1.84V7.63H3.3A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.05 1.05 4.37l3.24-2.53z"
        />
        <path
          fill="#EA4335"
          d="M12 6.13c1.43 0 2.72.49 3.73 1.46l2.8-2.8C16.83 3.25 14.63 2.25 12 2.25a9.75 9.75 0 0 0-8.7 5.38l3.24 2.53C7.31 7.85 9.46 6.13 12 6.13z"
        />
      </svg>

      {label}
    </a>
  );
};

export default GoogleButton;