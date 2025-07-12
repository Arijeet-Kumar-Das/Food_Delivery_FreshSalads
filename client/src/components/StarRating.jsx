import React, { useState } from "react";
import { FaStar } from "react-icons/fa";

/*
 props:
  - value: current rating (number, can be float) for display
  - editable: boolean, if true user can click to set
  - onChange: function(newValue)
  - size: tailwind text size e.g. 'text-xl'
*/
const StarRating = ({ value = 0, editable = false, onChange, size = "text-lg" }) => {
  const [hover, setHover] = useState(null);

  const displayValue = editable && hover !== null ? hover : value;

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          className={`${size} cursor-${editable ? "pointer" : "default"} ${
            displayValue >= star ? "text-yellow-400" : "text-gray-300"
          }`}
          onMouseEnter={() => editable && setHover(star)}
          onMouseLeave={() => editable && setHover(null)}
          onClick={() => editable && onChange && onChange(star)}
        />
      ))}
    </div>
  );
};

export default StarRating;
