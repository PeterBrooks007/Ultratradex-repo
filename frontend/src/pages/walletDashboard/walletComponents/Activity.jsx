import {
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  Skeleton,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { tokens } from "../../../theme";
import {
  ArrowDown,
  ArrowUp,
  MagnifyingGlass,
  XCircle,
} from "@phosphor-icons/react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  adminGetAllUserWalletTransactions,
  getUserWalletTransactions,
  SETSELECTEDTRANSACTION,
} from "../../../redux/features/walletTransactions/walletTransactionsSlice";
import TransactionDetails from "../../../components/dialogs/TransactionDetails";
import { adminGetUserWithdrawalhistory } from "../../../redux/features/withdrawal/withdrawalSlice";
import { useParams } from "react-router-dom";

const Activity = ({ transactionNumber }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();

  const { id } = useParams();

  const { isSemiLoading, allTransactions, isSuccess, isError } = useSelector(
    (state) => state.walletTransactions
  );

  const { user, singleUser } = useSelector((state) => state.auth);

  const { isLoading: coinPriceLoading } = useSelector(
    (state) => state.coinPrice
  );

  const { allCoins } = useSelector((state) => state.coinPrice);

  useEffect(() => {
    if (
      allTransactions.length === 0 &&
      isSuccess === false &&
      isError === false &&
      user?.role !== "admin"
    ) {
      dispatch(getUserWalletTransactions());
    }
  }, [dispatch, allTransactions, user?.role, isSuccess, isError]);

  useEffect(() => {
    if (singleUser && user?.role === "admin") {
      dispatch(adminGetAllUserWalletTransactions(id));
    }
  }, [singleUser, dispatch, id, user?.role]);

  let allTransactionsSlice;

  if (transactionNumber === "All") {
    allTransactionsSlice =
      Array.isArray(allTransactions) && allTransactions[0]?.transactions
        ? allTransactions[0].transactions
            .filter((transaction) => transaction && transaction?.createdAt) // Ensure transaction and createdAt exist
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by createdAt, newest first
            .slice() // Take the first 6 transactions
        : [];
  } else {
    allTransactionsSlice =
      Array.isArray(allTransactions) && allTransactions[0]?.transactions
        ? allTransactions[0].transactions
            .filter((transaction) => transaction && transaction?.createdAt) // Ensure transaction and createdAt exist
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by createdAt, newest first
            .slice(0, 5) // Take the first 6 transactions
        : [];
  }

  const combinedAssets = allTransactionsSlice?.map((asset) => {
    const priceData = allCoins?.find(
      (price) => price?.symbol === asset?.symbol?.toUpperCase()
    );

    if (priceData) {
      const totalValue =
        asset.balance *
        priceData?.quotes?.[
          user?.role !== "admin"
            ? user?.currency?.code
            : singleUser?.currency?.code
        ]?.price;
      return {
        ...asset,
        price:
          priceData?.quotes?.[
            user?.role !== "admin"
              ? user?.currency?.code
              : singleUser?.currency?.code
          ]?.price,
        totalValue,
      };
    }
    return { ...asset, price: 0, totalValue: 0 };
  });

  // console.log(combinedAssets)

  //start of search Transaction
  const [allTransactionList, setTransactionList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAllMailInbox = Array.isArray(allTransactionList)
    ? combinedAssets.filter(
        (transaction) =>
          transaction?.method
            .toLowerCase()
            .includes(searchTerm.toLowerCase().trim()) ||
          transaction?.symbol
            .toLowerCase()
            .includes(searchTerm.toLowerCase().trim()) ||
          String(transaction?.amount)
            .toLowerCase()
            .includes(searchTerm.toLowerCase().trim())
      )
    : [];

  useEffect(() => {
    if (allTransactionList.length !== 0) {
      setTransactionList(allTransactionList);
    }
  }, [allTransactionList]);
  //end of search Transaction

  const [openTransactionDetails, setOpenTransactionDetails] = useState(false);

  const handleCloseTransactionDetails = () => {
    setOpenTransactionDetails(false);
  };

  const handleopenTransactionDetails = () => {
    setOpenTransactionDetails(true);
  };

  return (
    <>
      {isSemiLoading ? (
        <Stack justifyContent={"center"} alignItems={"center"} mt={5}>
          <CircularProgress size={28} />
        </Stack>
      ) : (
        <>
          <Stack mt={0.5} mb={2.5}>
            <TextField
              label="Search"
              variant="outlined"
              fullWidth
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton aria-label="calculator" edge="end">
                      <MagnifyingGlass />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "20px",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderRadius: "20px",
                },
              }}
            />
          </Stack>

          <Stack spacing={1}>
            {allTransactionsSlice && allTransactionsSlice.length !== 0 ? (
              filteredAllMailInbox.map((transaction) => (
                <Stack
                  direction={"row"}
                  justifyContent={"space-between"}
                  key={transaction?._id}
                  sx={{
                    cursor: "pointer",
                    "&:hover": {
                      bgcolor: theme.palette.action.hover,
                    },
                  }}
                  onClick={() => {
                    dispatch(SETSELECTEDTRANSACTION(transaction));
                    handleopenTransactionDetails();
                  }}
                  py={1}
                >
                  <Stack direction={"row"} alignItems={"center"} spacing={1.5}>
                    <Box sx={{ position: "relative" }}>
                      <IconButton
                        sx={{
                          backgroundColor:
                            theme.palette.mode === "light"
                              ? "white"
                              : "#41464d",
                          color:
                            theme.palette.mode === "light"
                              ? "#202020"
                              : "white",
                          borderRadius: "10px",
                          border:
                            transactionNumber === "All"
                              ? `${
                                  theme.palette.mode === "light"
                                    ? "0.5px solid lightgrey"
                                    : ""
                                }`
                              : "none",
                        }}
                      >
                        {transaction?.typeOfTransaction.toLowerCase() ===
                        "sent" ? (
                          <ArrowUp />
                        ) : (
                          <ArrowDown />
                        )}
                      </IconButton>
                      <Box position={"absolute"} bottom={-10} right={-5}>
                        <img
                          src={transaction?.methodIcon}
                          alt={transaction?.method}
                          width="16px"
                          style={{
                            borderRadius: "50%",
                            backgroundColor: "white",
                          }}
                        />
                      </Box>
                    </Box>
                    <Stack>
                      <Typography variant="subtitle2">
                        {transaction?.typeOfTransaction +
                          " " +
                          transaction?.symbol.toUpperCase()}
                      </Typography>
                      <Typography variant="caption">
                        {" "}
                        {new Intl.DateTimeFormat("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }).format(new Date(transaction?.createdAt))}
                      </Typography>
                    </Stack>
                  </Stack>

                  <Stack textAlign={"right"}>
                    {user?.role !== "admin" ? (
                      <Typography variant="subtitle2">
                        {user?.isManualAssetMode === false ? (
                          coinPriceLoading ? (
                            <Skeleton width={100} />
                          ) : (
                            Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: user?.currency?.code,
                              ...(transaction?.amount > 999999
                                ? { notation: "compact" }
                                : {}),
                            }).format(transaction?.amount * transaction?.price)
                          )
                        ) : (
                          Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: user?.currency?.code,
                            ...(transaction?.amount > 999999
                              ? { notation: "compact" }
                              : {}),
                          }).format(transaction?.amount)
                        )}
                      </Typography>
                    ) : (
                      <Typography variant="subtitle2">
                        {singleUser?.isManualAssetMode === false ? (
                          coinPriceLoading ? (
                            <Skeleton width={100} />
                          ) : (
                            Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: singleUser?.currency?.code,
                              ...(transaction?.amount > 999999
                                ? { notation: "compact" }
                                : {}),
                            }).format(transaction?.amount * transaction?.price)
                          )
                        ) : (
                          Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: singleUser?.currency?.code,
                            ...(transaction?.amount > 999999
                              ? { notation: "compact" }
                              : {}),
                          }).format(transaction?.amount)
                        )}
                      </Typography>
                    )}

                    {user?.role !== "admin" ? (
                      <Typography variant="caption">
                        {user?.isManualAssetMode === false &&
                          Number(transaction?.amount).toFixed(8) +
                            " " +
                            transaction?.symbol.toUpperCase()}
                      </Typography>
                    ) : (
                      <Typography variant="caption">
                        {singleUser?.isManualAssetMode === false &&
                          Number(transaction?.amount).toFixed(8) +
                            " " +
                            transaction?.symbol.toUpperCase()}
                      </Typography>
                    )}
                  </Stack>
                </Stack>
              ))
            ) : (
              <Stack alignItems={"center"} justifyContent={"center"} pt={2}>
                <XCircle size={60} />
                <Typography>No Transactions</Typography>
              </Stack>
            )}
          </Stack>

          <TransactionDetails
            open={openTransactionDetails}
            handleClose={handleCloseTransactionDetails}
            handleOpen={handleopenTransactionDetails}
          />
        </>
      )}
    </>
  );
};

export default Activity;
