import { useRef } from "react";
import { Camera, Upload } from "lucide-react";

export const AvatarUpload = ({ avatar, setAvatar }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center mb-4 md:mb-6">
      <div className="relative">
        <div
          className={`w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center overflow-hidden border-2 border-blue-200 ${
            avatar
              ? "bg-white"
              : "bg-gradient-to-br from-blue-500/10 to-green-400/10"
          }`}
          style={{ boxShadow: "0 0 20px rgba(59, 130, 246, 0.15)" }}
        >
          {avatar ? (
            <img
              src={avatar}
              alt="Agent avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <Camera className="w-6 h-6 md:w-8 md:h-8 text-blue-400" />
          )}
        </div>
        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-1 md:p-1.5 shadow-md transition-all"
        >
          <Upload className="w-3 h-3 md:w-4 md:h-4" />
        </button>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
      <span className="text-xs font-medium text-gray-600 mt-2">
        Upload agent portrait
      </span>
    </div>
  );
};
