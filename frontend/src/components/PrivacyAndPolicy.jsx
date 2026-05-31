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

function PrivacyAndPolicy() {
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

        <Box sx={{ maxWidth: "xl", margin: "0 auto", padding: 0 }}>
          {/* <Typography variant="h3" gutterBottom>
            Privacy Policy
          </Typography>
          <Typography variant="body1" paragraph>
            Last Updated: January 2025
          </Typography> */}

          <Typography variant="h5" color="primary" gutterBottom>
            1. Introduction
          </Typography>
          <Typography variant="body1" paragraph>
            Welcome to ultratradex. Your privacy is important to us.
            This privacy policy outlines how we collect, use, and protect your
            personal and financial data when you use our services for trading
            stocks, forex, and cryptocurrencies. By using our platform, you
            agree to the terms outlined in this policy.
          </Typography>

          <Typography variant="h5" color="primary" gutterBottom>
            2. Information We Collect
          </Typography>
          <Typography variant="body1" paragraph>
            We collect the following types of information:
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Personal Information:</strong> Name, email address, phone
            number, and other identification information.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Financial Data:</strong> Transaction history, account
            balances, trading activity, and other data necessary for financial
            processing.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Device and Usage Information:</strong> IP address, browser
            type, device information, and user interactions with the platform.
          </Typography>

          <Typography variant="h5" color="primary" gutterBottom>
            2.1 Financial Data Collection
          </Typography>
          <Typography variant="body1" paragraph>
            As part of our services, we collect sensitive financial data such as
            your trading history, account balances, transaction records, and
            other data necessary to process and verify trades. We may also
            request identity verification information to comply with Know Your
            Customer (KYC) and Anti-Money Laundering (AML) regulations.
          </Typography>

          <Typography variant="h5" color="primary" gutterBottom>
            2.2 Use of Financial Data
          </Typography>
          <Typography variant="body1" paragraph>
            The financial data we collect is used for processing your
            transactions, providing real-time market data, offering trade
            analysis tools, and ensuring compliance with regulatory
            requirements. We may also use this data to detect and prevent fraud
            or suspicious activities on our platform.
          </Typography>

          <Typography variant="h5" color="primary" gutterBottom>
            3. How We Use Your Information
          </Typography>
          <Typography variant="body1" paragraph>
            We use the information we collect for the following purposes:
          </Typography>
          <Typography variant="body1" paragraph>
            - To provide and improve our trading services.
          </Typography>
          <Typography variant="body1" paragraph>
            - To process transactions and provide account management.
          </Typography>
          <Typography variant="body1" paragraph>
            - To comply with legal and regulatory obligations (e.g., KYC, AML).
          </Typography>
          <Typography variant="body1" paragraph>
            - To send you transaction confirmations, market updates, and other
            important notices.
          </Typography>

          <Typography variant="h5" color="primary" gutterBottom>
            4. Compliance with Regulations
          </Typography>
          <Typography variant="body1" paragraph>
            We comply with applicable laws and regulations, including the Know
            Your Customer (KYC) and Anti-Money Laundering (AML) requirements. By
            using our platform, you agree to provide any information or
            documentation necessary to verify your identity or trading activity,
            as required by law.
          </Typography>

          <Typography variant="h5" color="primary" gutterBottom>
            5. Cryptocurrency Transactions
          </Typography>
          <Typography variant="body1" paragraph>
            If you engage in cryptocurrency transactions on our platform, we may
            collect and store information related to your crypto wallet
            addresses, transaction hashes, and crypto holdings. Please be aware
            that cryptocurrency transactions are irreversible, and we cannot
            offer refunds or chargebacks for any cryptocurrency trades.
          </Typography>

          <Typography variant="h5" color="primary" gutterBottom>
            6. Security of Financial Transactions
          </Typography>
          <Typography variant="body1" paragraph>
            We implement robust security measures to protect your financial
            transactions, including encryption of sensitive data during
            transfer, multi-factor authentication (MFA), and secure storage of
            your personal and financial information. However, due to the nature
            of financial markets, we cannot guarantee absolute security against
            cyber-attacks.
          </Typography>

          <Typography variant="h5" color="primary" gutterBottom>
            7. Risk Disclosure
          </Typography>
          <Typography variant="body1" paragraph>
            Trading stocks, forex, and cryptocurrencies involves a significant
            level of risk, including the loss of principal. By using our
            platform, you acknowledge that you understand the risks involved in
            trading and investing and agree that we are not liable for any
            losses incurred. Please ensure you understand these risks before
            trading.
          </Typography>

          <Typography variant="h5" color="primary" gutterBottom>
            8. Data Sharing and Disclosure
          </Typography>
          <Typography variant="body1" paragraph>
            We do not share your personal or financial information with third
            parties, except in the following circumstances:
          </Typography>
          <Typography variant="body1" paragraph>
            - To comply with legal obligations or respond to a lawful request
            from authorities.
          </Typography>
          <Typography variant="body1" paragraph>
            - With service providers who assist us in operating the platform and
            providing our services, under strict confidentiality agreements.
          </Typography>

          <Typography variant="h5" color="primary" gutterBottom>
            9. Your Rights and Choices
          </Typography>
          <Typography variant="body1" paragraph>
            You have the right to:
          </Typography>
          <Typography variant="body1" paragraph>
            - Access and correct your personal data.
          </Typography>
          <Typography variant="body1" paragraph>
            - Withdraw consent for certain data processing activities.
          </Typography>
          <Typography variant="body1" paragraph>
            - Request deletion of your data, subject to legal and contractual
            obligations.
          </Typography>

          <Typography variant="h5" color="primary" gutterBottom>
            10. Changes to This Privacy Policy
          </Typography>
          <Typography variant="body1" paragraph>
            We may update this privacy policy from time to time. We will notify
            you of any material changes by posting the new privacy policy on
            this page with an updated date. We encourage you to review this
            privacy policy periodically for any updates.
          </Typography>

          <Typography variant="h5" color="primary" gutterBottom>
            11. Contact Us
          </Typography>
          <Typography variant="body1" paragraph>
            If you have any questions about this privacy policy or our data
            practices, please contact us at:
          </Typography>
          <Typography variant="body1" paragraph>
             ultratradex
            <br />
           
            Email: support@ultratradex.io
            {/* <br />
            Phone: [Your Contact Phone] */}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default PrivacyAndPolicy;
