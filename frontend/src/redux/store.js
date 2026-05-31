import { configureStore } from "@reduxjs/toolkit";
import appReducer from "../redux/features/app/appSlice"
import authReducer from "../redux/features/auth/authSlice"
import withdrawalReducer from "../redux/features/withdrawal/withdrawalSlice"
import depositReducer from "../redux/features/deposit/depositSlice"
import coinPriceReducer from "../redux/features/coinPrice/coinPriceSlice"
import expertTradersReducer from "../redux/features/expertTraders/expertTradersSlice"
import tradingBotsReducer from "../redux/features/tradingBots/tradingBotsSlice"
import tradingSignalsReducer from "../redux/features/tradingSignals/tradingSignalsSlice"
import walletAddressReducer from "../redux/features/walletAddress/walletAddressSlice"
import mailboxReducer from "../redux/features/mailbox/mailboxSlice"
import connectWalletReducer from "../redux/features/connectWallet/connectWalletSlice"
import tradingSettingsReducer from "./features/tradingSettings/tradingSettingsSlice"
import totalCountReducer from "./features/totalCounts/totalCountsSlice"
import tradesReducer from "./features/trades/tradesSlice"
import nftSettingsReducer from "./features/nftSettings/nftSettingsSlice"
import walletTransactionsReducer from "./features/walletTransactions/walletTransactionsSlice"
import notificationsReducer from "./features/notifications/notificationsSlice"


export const store = configureStore({
    reducer: {
        app: appReducer,
        auth: authReducer,
        withdrawal: withdrawalReducer,
        deposit: depositReducer,
        coinPrice: coinPriceReducer,
        expertTraders: expertTradersReducer,
        tradingBots: tradingBotsReducer,
        tradingSignals: tradingSignalsReducer,
        walletAddress: walletAddressReducer,
        mailbox: mailboxReducer,
        connectWallet: connectWalletReducer,
        tradingSettings: tradingSettingsReducer,
        totalCounts: totalCountReducer,
        trades: tradesReducer,
        nftSettings: nftSettingsReducer,
        walletTransactions: walletTransactionsReducer,
        notifications: notificationsReducer
    }
})