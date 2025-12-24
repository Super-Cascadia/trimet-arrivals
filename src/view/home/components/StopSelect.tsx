import React from "react";
import { Form } from "react-bootstrap";
import Select from "react-select";
import { StopOption } from "../hooks/useTrimetStops";
import StopLocationIndicator from "../../../component/stop/StopLocationIndicator";
import "./StopSelect.scss";

interface StopSelectProps {
  label: string;
  value: StopOption | null;
  onChange: (option: StopOption | null) => void;
  options: any[];
  isLoading?: boolean;
  customStyles?: any;
  isClearable?: boolean;
  isSearchable?: boolean;
}

function StopSelect({
  label,
  value,
  onChange,
  options,
  isLoading = false,
  customStyles,
  isClearable = true,
  isSearchable = true,
}: StopSelectProps) {
  // Detect dark mode
  const isDarkMode = document.documentElement.getAttribute('data-bs-theme') === 'dark';

  // Define theme based on dark mode
  const selectTheme = (baseTheme: any) => ({
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: '#667eea', // selected and focused colors
      primary75: '#7b8eee',
      primary50: '#8b9ef7',
      primary25: '#d4d9f7',
      danger: '#ff6b6b',
      dangerLight: '#ffe0e0',
      neutral0: isDarkMode ? '#212529' : '#ffffff', // background
      neutral5: isDarkMode ? '#2a2d34' : '#f7f9fc',
      neutral10: isDarkMode ? '#343940' : '#efefef',
      neutral20: isDarkMode ? '#495057' : '#e0e0e0',
      neutral30: isDarkMode ? '#6c757d' : '#cccccc',
      neutral40: isDarkMode ? '#adb5bd' : '#999999',
      neutral50: isDarkMode ? '#adb5bd' : '#808080',
      neutral60: isDarkMode ? '#e9ecef' : '#666666',
      neutral70: isDarkMode ? '#e9ecef' : '#333333',
      neutral80: isDarkMode ? '#e9ecef' : '#000000',
      neutral90: isDarkMode ? '#f8f9fa' : '#000000',
    },
  });

  const defaultCustomStyles = customStyles || {
    control: (base: any) => ({
      ...base,
      padding: "0.25rem 0",
      borderRadius: "8px",
      border: "none",
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
      transition: "all 0.3s ease",
    }),
    option: (base: any, state: any) => {
      const bgColor = state.isSelected 
        ? '#667eea'
        : state.isFocused
          ? (isDarkMode ? '#495057' : '#f0f0f0')
          : (isDarkMode ? '#212529' : '#ffffff');
      
      const textColor = state.isSelected 
        ? '#ffffff'
        : (isDarkMode ? '#e9ecef' : '#333333');
      
      return {
        backgroundColor: bgColor,
        color: textColor,
        padding: "10px 12px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        transition: "all 0.15s ease",
      };
    },
    menu: (base: any) => ({
      ...base,
      backgroundColor: isDarkMode ? '#212529' : '#ffffff',
      borderRadius: '8px',
      marginTop: '0.5rem',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
      zIndex: 9999,
    }),
    menuList: (base: any) => ({
      ...base,
      padding: 0,
      maxHeight: '300px',
    }),
    group: (base: any) => ({
      padding: 0,
    }),
    groupHeading: (base: any) => ({
      ...base,
      color: isDarkMode ? '#8b9ef7' : '#667eea',
      fontWeight: "600",
      fontSize: "0.85rem",
      backgroundColor: isDarkMode ? '#212529' : '#ffffff',
      padding: "8px 12px",
      marginBottom: "4px",
    }),
  };

  return (
    <Form.Group className="search-input-group">
      <Form.Label className="search-label">{label}</Form.Label>
      <Select
        options={options}
        value={value}
        onChange={(option) => onChange(option)}
        isLoading={isLoading}
        isClearable={isClearable}
        isSearchable={isSearchable}
        placeholder="Select a stop or location..."
        styles={defaultCustomStyles}
        theme={selectTheme}
        formatOptionLabel={(option: StopOption) => {
          // Extract just the description part, removing the "(ID)" suffix
          const description = option.label.replace(/\s*\(\d+\)$/, '');
          const isDarkMode = document.documentElement.getAttribute('data-bs-theme') === 'dark';
          return (
            <div className="stop-option-label" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <StopLocationIndicator
                locationId={parseInt(option.value, 10)}
                size="small"
              />
              <span style={{ color: 'inherit' }}>{description}</span>
            </div>
          );
        }}
        className="react-select"
        classNamePrefix="react-select"
        menuPortalTarget={document.body}
      />
    </Form.Group>
  );
}

export default StopSelect;
