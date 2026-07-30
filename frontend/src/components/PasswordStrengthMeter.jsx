import React from "react";
import { Check, X } from "lucide-react";

const PasswordStrengthMeter = ({ password = "" }) => {
  const requirements = [
    { label: "At least 6 characters", met: password.length >= 6 },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Contains number", met: /[0-9]/.test(password) },
    { label: "Contains special character", met: /[^A-Za-z0-9]/.test(password) },
  ];

  const score = requirements.filter((r) => r.met).length;

  const getStrengthLabel = () => {
    if (password.length === 0) return { label: "", color: "bg-gray-700" };
    if (score <= 1) return { label: "Weak", color: "bg-red-500", text: "text-red-400" };
    if (score === 2) return { label: "Fair", color: "bg-yellow-500", text: "text-yellow-400" };
    if (score === 3) return { label: "Good", color: "bg-indigo-500", text: "text-indigo-400" };
    return { label: "Strong", color: "bg-emerald-500", text: "text-emerald-400" };
  };

  const strength = getStrengthLabel();

  return (
    <div className="mt-2 space-y-2">
      {/* Animated Strength Bar */}
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="text-gray-400">Password Strength</span>
        <span className={`font-semibold ${strength.text || "text-gray-400"}`}>
          {strength.label}
        </span>
      </div>

      <div className="flex gap-1.5 h-1.5 w-full">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`h-full flex-1 rounded-full transition-all duration-300 ${
              step <= score ? strength.color : "bg-white/10"
            }`}
          />
        ))}
      </div>

      {/* Requirement List */}
      <div className="grid grid-cols-2 gap-1.5 pt-1">
        {requirements.map((req, idx) => (
          <div key={idx} className="flex items-center text-[11px] gap-1.5">
            {req.met ? (
              <Check className="w-3 h-3 text-emerald-400 shrink-0" />
            ) : (
              <X className="w-3 h-3 text-gray-500 shrink-0" />
            )}
            <span className={req.met ? "text-gray-200" : "text-gray-500"}>
              {req.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;
