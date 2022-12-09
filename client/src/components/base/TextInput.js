import React from "react";
import '../../styles/base/TextInput.css';

//Base Input Component
//Usage: <Input width='550px' height='30px' />

const TextInput = ({width,height, placeholder='default input', icon,type, disabled, onChange}) => {
  return (
    <div className="search-wrapper">
      <div
        className="search-container"
        style={{
          width:`${width}`,
          height:`${height}`,
          background: `radial-gradient(
                    circle,
                    rgba(255, 255, 255, 0.05) 0%,
                    rgba(48,118,234,0.2) 0%,
                    rgba(255, 255, 255, 0.05) 70%
                )`,
        }}
      >
        <input id="search" placeholder={placeholder} type={type} disabled ={disabled} onChange = {onChange}/>
        {icon}
      </div>
    </div>
  );
};

export default TextInput;

// first addy 0xb1cfBb1196f909D1F5Aa28A1738dd0ff6873301A
