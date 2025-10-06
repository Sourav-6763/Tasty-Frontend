import React, { useState } from "react";
import FadeLoader from "react-spinners/FadeLoader";

function Loder({ loading }) {
  // let [loading, setLoading] = useState(true);
  let [color, setColor] = useState("#FF0000");
  return (
    <>
      <div className="sweet-loading loader-overlay">
        <FadeLoader
          color={color}
          loading={loading}
          height={8} // smaller height
          width={2} // thinner lines
          margin={-9} // tighter spacing
          cssOverride={{
            display: "inline-block",
            verticalAlign: "middle",
          }}
          aria-label="Loading Spinner"
        />
      </div>
    </>
  );
}

export default Loder;
