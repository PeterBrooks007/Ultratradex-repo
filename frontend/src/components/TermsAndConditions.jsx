import React from "react";
import {
  Container,
  Typography,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";

function TermsAndConditions() {
  return (
    <Container maxWidth="xl" sx={{ paddingTop: 4 }}>
      <Paper elevation={3} sx={{ padding: 4 }}>
        {/* Header Section */}
        {/* <Box sx={{ textAlign: 'center', marginBottom: 4 }}>
          <Typography variant="h3" color="primary" gutterBottom>
            Terms and Conditions
          </Typography>
          <Typography variant="h6" color="textSecondary">
            Please read the following terms and conditions carefully before using our platform.
          </Typography>
        </Box> */}

        {/* Section 1: Introduction */}
        <Box sx={{ marginBottom: 4 }}>
          <Typography variant="h5" color="primary" gutterBottom>
            1. Introduction
          </Typography>
          <Typography variant="body1" paragraph>
            Welcome to our trading platform. By accessing or using the services
            provided by our platform, you agree to comply with and be bound by
            the following terms and conditions. These terms apply to all users
            who access our platform for trading Forex, Stocks, and
            Cryptocurrencies.
          </Typography>
          <Typography variant="body1" paragraph>
            If you do not agree to these terms, you must refrain from using the
            platform. These terms and conditions are subject to change, and we
            encourage you to review them periodically.
          </Typography>
        </Box>

        {/* Section 2: Services Provided */}
        <Box sx={{ marginBottom: 4 }}>
          <Typography variant="h5" color="primary" gutterBottom>
            2. Services Provided
          </Typography>
          <Typography variant="body1" paragraph>
            We provide access to various financial markets, including Forex,
            Stocks, and Cryptocurrencies. Through our platform, users can
            execute trades, track asset prices, and manage portfolios. The
            platform aims to provide real-time data and an intuitive interface
            to make trading more accessible.
          </Typography>
        </Box>

        {/* Section 3: User Eligibility */}
        <Box sx={{ marginBottom: 4 }}>
          <Typography variant="h5" color="primary" gutterBottom>
            3. User Eligibility
          </Typography>
          <Typography variant="body1" paragraph>
            You must be at least 18 years of age to use this platform.
            Additionally, you confirm that you are not located in any
            jurisdiction where access to or use of the platform is prohibited.
          </Typography>
        </Box>

        {/* Section 4: Account Registration */}
        <Box sx={{ marginBottom: 4 }}>
          <Typography variant="h5" color="primary" gutterBottom>
            4. Account Registration
          </Typography>
          <Typography variant="body1" paragraph>
            To access certain features of the platform, you must create an
            account. During registration, you are required to provide accurate
            and complete information. This includes personal details and a valid
            email address. You are responsible for maintaining the
            confidentiality of your account credentials and for all activities
            under your account.
          </Typography>
        </Box>

        {/* Section 5: Risk Acknowledgment */}
        <Box sx={{ marginBottom: 4 }}>
          <Typography variant="h5" color="primary" gutterBottom>
            5. Risk Acknowledgment
          </Typography>
          <Typography variant="body1" paragraph>
            Trading involves significant risk, including the potential loss of
            capital. You acknowledge and agree that you are fully responsible
            for any losses incurred during the use of the platform. The market
            conditions are unpredictable, and no guarantees or representations
            can be made regarding the outcome of your trades.
          </Typography>
        </Box>

        {/* Section 6: User Obligations */}
        <Box sx={{ marginBottom: 4 }}>
          <Typography variant="h5" color="primary" gutterBottom>
            6. User Obligations
          </Typography>
          <Typography variant="body1" paragraph>
            By using our platform, you agree to:
          </Typography>
          <List sx={{ paddingLeft: 2 }}>
            <ListItem>
              <ListItemText primary="Comply with all applicable laws and regulations regarding financial transactions." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Maintain the confidentiality of your account information, including username and password." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Notify us immediately if you suspect any unauthorized activity on your account." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Not engage in fraudulent, manipulative, or illegal activities on the platform." />
            </ListItem>
          </List>
        </Box>

        {/* Section 7: Account Verification */}
        <Box sx={{ marginBottom: 4 }}>
          <Typography variant="h5" color="primary" gutterBottom>
            7. Account Verification
          </Typography>
          <Typography variant="body1" paragraph>
            To access the full range of services on the platform, you are
            required to undergo a Know Your Customer (KYC) process. This may
            involve submitting identification documents to verify your identity.
          </Typography>
        </Box>

        {/* Section 8: Limitation of Liability */}
        <Box sx={{ marginBottom: 4 }}>
          <Typography variant="h5" color="primary" gutterBottom>
            8. Limitation of Liability
          </Typography>
          <Typography variant="body1" paragraph>
            We do not accept liability for any losses resulting from trading
            activities, technical issues, or any other cause not under our
            direct control. You agree that the platform is provided “as-is,” and
            we do not guarantee its uninterrupted availability.
          </Typography>
        </Box>

        {/* Section 9: Privacy Policy */}
        <Box sx={{ marginBottom: 4 }}>
          <Typography variant="h5" color="primary" gutterBottom>
            9. Privacy Policy
          </Typography>
          <Typography variant="body1" paragraph>
            By using this platform, you agree to our Privacy Policy, which
            outlines how we collect, use, and store your personal data. For more
            details, please refer to our full Privacy Policy.
          </Typography>
        </Box>

        {/* Section 10: Fees and Charges */}
        <Box sx={{ marginBottom: 4 }}>
          <Typography variant="h5" color="primary" gutterBottom>
            10. Fees and Charges
          </Typography>
          <Typography variant="body1" paragraph>
            The platform charges certain fees for services, including but not
            limited to trading fees, deposit/withdrawal fees, and currency
            conversion fees. These fees may change at the platform&apos;s discretion.
          </Typography>
        </Box>

        {/* Section 11: Termination of Service */}
        <Box sx={{ marginBottom: 4 }}>
          <Typography variant="h5" color="primary" gutterBottom>
            11. Termination of Service
          </Typography>
          <Typography variant="body1" paragraph>
            We reserve the right to suspend or terminate your account if we
            suspect any violation of these terms and conditions. In case of
            termination, you will lose access to your account and all associated
            data, and any open trades will be closed according to platform
            policies.
          </Typography>
        </Box>

        {/* Section 12: Governing Law */}
        <Box sx={{ marginBottom: 4 }}>
          <Typography variant="h5" color="primary" gutterBottom>
            12. Governing Law
          </Typography>
          <Typography variant="body1" paragraph>
            These terms and conditions are governed by the laws of the
            jurisdiction in which the platform operates. Any disputes arising
            from these terms will be resolved under the jurisdiction of the
            appropriate courts in that jurisdiction.
          </Typography>
        </Box>

        {/* Section 13: Amendments */}
        <Box sx={{ marginBottom: 4 }}>
          <Typography variant="h5" color="primary" gutterBottom>
            13. Amendments
          </Typography>
          <Typography variant="body1" paragraph>
            We reserve the right to modify, update, or amend these terms at any
            time. We will notify users of significant changes, and the updated
            terms will be available on the platform.
          </Typography>
        </Box>

        {/* Section 14: Dispute Resolution and Arbitration */}
        <Box sx={{ marginBottom: 4 }}>
          <Typography variant="h5" color="primary" gutterBottom>
            14. Dispute Resolution and Arbitration
          </Typography>
          <Typography variant="body1" paragraph>
            Any disputes arising from your use of the platform will be resolved
            through binding arbitration, rather than in court. The jurisdiction
            for disputes shall be governed by the laws of the country where the
            platform is incorporated.
          </Typography>
        </Box>

        {/* Section 15: Force Majeure */}
        <Box sx={{ marginBottom: 4 }}>
          <Typography variant="h5" color="primary" gutterBottom>
            15. Force Majeure
          </Typography>
          <Typography variant="body1" paragraph>
            The platform is not responsible for failure to perform its
            obligations due to circumstances beyond its control, including but
            not limited to natural disasters, wars, or technical disruptions.
          </Typography>
        </Box>

        {/* Section 16: User Feedback and Suggestions */}
        <Box sx={{ marginBottom: 4 }}>
          <Typography variant="h5" color="primary" gutterBottom>
            16. User Feedback and Suggestions
          </Typography>
          <Typography variant="body1" paragraph>
            By submitting feedback or suggestions to the platform, you grant the
            platform a non-exclusive, royalty-free license to use, modify, or
            incorporate the suggestions into the platform’s services.
          </Typography>
        </Box>

        {/* Section 17: Withdrawal and Deposit Terms */}
        <Box sx={{ marginBottom: 4 }}>
          <Typography variant="h5" color="primary" gutterBottom>
            17. Withdrawal and Deposit Terms
          </Typography>
          <Typography variant="body1" paragraph>
            You may deposit or withdraw funds using various methods, including
            bank transfers and cryptocurrencies. Each transaction is subject to
            platform approval, and limits may apply to deposits or withdrawals.
          </Typography>
        </Box>

        {/* Section 18: Termination and Suspension of Account */}
        <Box sx={{ marginBottom: 4 }}>
          <Typography variant="h5" color="primary" gutterBottom>
            18. Termination and Suspension of Account
          </Typography>
          <Typography variant="body1" paragraph>
            The platform reserves the right to suspend or terminate your account
            if any terms are violated. If your account is terminated, you will
            no longer have access to services, and any funds in your account
            will be subject to applicable withdrawal terms.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default TermsAndConditions;
