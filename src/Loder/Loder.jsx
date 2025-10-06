import React, { useState } from 'react'
import PuffLoader from "react-spinners/PuffLoader";

function Loder({loading}) {
    // let [loading, setLoading] = useState(true);
    let [color, setColor] = useState("#FF0000");
  return (
    <>
     <div className="sweet-loading loader-overlay">
          <PuffLoader
            color={color}
            loading={loading}
            cssOverride={{
              display: "block",
              margin: "0 auto",
              borderColor: "red",
            }}
            size={60}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
    </>
  )
}

export default Loder