import { theme } from "antd";

// Custom Ant Design theme configuration with red color palette
const customTheme = {
  algorithm: theme.defaultAlgorithm,
  token: {
    // Primary color - Red palette
    colorPrimary: "#dc2626",
    colorPrimaryHover: "#b91c1c",
    colorPrimaryActive: "#991b1b",
    
    // Success, Warning, Error colors
    colorSuccess: "#10b981",
    colorWarning: "#f59e0b",
    colorError: "#dc2626",
    colorInfo: "#3b82f6",
    
    // Border and background
    colorBorder: "#e5e7eb",
    colorBgContainer: "#ffffff",
    colorBgElevated: "#ffffff",
    colorBgLayout: "#fafafa",
    
    // Text colors
    colorText: "#1f1f1f",
    colorTextSecondary: "#535353",
    colorTextTertiary: "#9ca3af",
    
    // Border radius
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 6,
    
    // Font
    fontFamily: '"Poppins", sans-serif',
    fontSize: 14,
    fontSizeLG: 16,
    fontSizeSM: 12,
    
    // Spacing
    padding: 16,
    paddingLG: 24,
    paddingSM: 12,
    paddingXS: 8,
    
    // Shadows
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    boxShadowSecondary: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  },
  components: {
    Button: {
      primaryColor: "#ffffff",
      borderRadius: 8,
      controlHeight: 40,
      fontWeight: 600,
      boxShadow: "0 2px 4px rgba(220, 38, 38, 0.2)",
    },
    Card: {
      borderRadius: 12,
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      paddingLG: 24,
    },
    Table: {
      borderRadius: 8,
      headerBg: "#fafafa",
      headerColor: "#1f1f1f",
      borderColor: "#e5e7eb",
    },
    Input: {
      borderRadius: 8,
      controlHeight: 40,
      activeBorderColor: "#dc2626",
      hoverBorderColor: "#b91c1c",
    },
    Select: {
      borderRadius: 8,
      controlHeight: 40,
    },
    Modal: {
      borderRadius: 12,
      paddingContentHorizontal: 24,
    },
    Form: {
      labelColor: "#1f1f1f",
      labelFontSize: 14,
      labelHeight: 32,
    },
    Tag: {
      borderRadius: 6,
      fontSize: 12,
    },
    Statistic: {
      titleFontSize: 14,
      contentFontSize: 24,
    },
  },
};

export default customTheme;



