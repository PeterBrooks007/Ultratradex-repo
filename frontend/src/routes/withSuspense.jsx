import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  SET_ISLOADING_FALSE,
  SET_ISLOADING_TRUE,
} from "../redux/features/app/appSlice";
import LoadingScreen from "../components/LoadingScreen";

const withLoading = (Component) => {
  return function WithLoadingComponent(props) {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      dispatch(SET_ISLOADING_TRUE());
      return () => {
        dispatch(SET_ISLOADING_FALSE());
      };
    }, [dispatch]);

    useEffect(() => {
      setLoading(false);
    }, []);

    if (loading) return <LoadingScreen />;

    return <Component {...props} />;
  };
};

export default withLoading;
