import React from "react";
import { Plus, PlusIcon } from "lucide-react";

const CreateNewButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center space-x-2 bg-[#4CC490] text-white px-5 py-3 rounded-lg hover:bg-[#3db87a] transition-colors font-medium shadow-sm hover:shadow-md"
    >
      <PlusIcon size={18} strokeWidth={3} />
      <span>Create new</span>
    </button>
  );
};

export default CreateNewButton;
