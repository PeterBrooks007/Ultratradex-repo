import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import AccountOverview from "./AccountOverview";
import ReferralSystem from "./ReferralSystem";
import AccountVerifications from "./AccountVerifications";
import SecuritySystem from "./SecuritySystem";
import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function ProfileTabs({profile, setProfile}) {
  const [value, setValue] = React.useState(0);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box
          backgroundColor={
            theme.palette.mode === "light"
              ? "#f2f2f2"
              : colors.dashboardbackground[100]
          }
          height={"38px"}
          borderRadius={"20px"}
          p={"3px"}
          mt={2}
          mx={2}
        >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          variant="fullWidth"
            centered
            sx={{
              "& .MuiTabs-indicator": {
                backgroundColor: "transparent",
              },
              "& .MuiTab-root": {
                textTransform: "none",
                minHeight: "32px",
                padding: "4px 12px",
                minWidth: "auto",
                borderRadius: "20px",
                border: "none",
                borderBottom: "2px solid transparent",
                "&:hover": {
                  //   border: "2px solid #ccc",
                },
                "&.Mui-selected": {
                  // border: "2px solid #007bff",
                  backgroundColor: "white",
                  // boxShadow: `${theme.shadows[2]}`,
                  color: "black",
                },
              },
            }}
        >
          <Tab label="Account Overview" {...a11yProps(0)} />
          <Tab label="Referral System" {...a11yProps(1)} />
          <Tab label="Account Verifications" {...a11yProps(2)} />
          <Tab label="Security System" {...a11yProps(3)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <AccountOverview profile={profile} setProfile={setProfile} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <ReferralSystem />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <AccountVerifications />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <SecuritySystem />
      </CustomTabPanel>
    </Box>
  );
}
