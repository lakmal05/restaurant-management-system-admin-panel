//Include Both Helper File with needed methods
import { getFirebaseBackend } from "../../../helpers/firebase_helper";

import {
  loginSuccess,
  logoutUserSuccess,
  apiError,
  reset_login_flag,
} from "./reducer";
import { loginService } from "../../../service/auth";
import * as authService from "../../../service/auth";
import * as constant from "../../../common/constants";
import Cookies from "js-cookie";
import { customToastMsg } from "../../../common/commonFunctions";

export const loginUser = (user, history) => async (dispatch) => {
  try {
    let response;

    let userDetails = {
      // "grant_type": "password",
      // "client_id": constant.Client_ID,
      // "client_secret": constant.Client_Secret,
      username: user.email,
      password: user.password,
    };
    authService
      .loginService(userDetails)
      .then((res) => {
        let pp = [];
        const response = res?.data;
        Cookies.set(constant.ACCESS_TOKEN, response?.token);
        Cookies.set(constant.REFRESH_TOKEN, response?.refreshToken);
        Cookies.set(constant.Expire_time, response?.tokenExpires);
        sessionStorage.setItem("authUser", JSON.stringify(response?.user));
        let permissionEncode = response?.user?.rolePermissions;
        permissionEncode.map((p, index) => {
          pp.push(btoa(p));
        });
        Cookies.set(constant.PERMISSION, JSON.stringify(pp));
        window.location.href = "/dashboard";
        setTimeout(() => {}, 2000);
        customToastMsg("Login successfully", 1);
      })
      .catch((c) => {
        popUploader(dispatch, false);
        handleError(c);
      });
    var data = await response;
  } catch (error) {
    console.log(error);
    dispatch(apiError(error));
  }
};

export const logoutUser = () => async (dispatch) => {
  try {
    Cookies.remove(constant.ACCESS_TOKEN);
    Cookies.remove(constant.REFRESH_TOKEN);
    Cookies.remove(constant.Expire_time);
    Cookies.remove(constant.PERMISSION);
    sessionStorage.removeItem("authUser");
    dispatch(logoutUserSuccess(true));
  } catch (error) {
    dispatch(apiError(error));
  }
};

export const socialLogin = (type, history) => async (dispatch) => {
  try {
    let response;

    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      const fireBaseBackend = getFirebaseBackend();
      response = fireBaseBackend.socialLoginUser(type);
    }
    //  else {
    //   response = postSocialLogin(data);
    // }

    const socialdata = await response;
    if (socialdata) {
      sessionStorage.setItem("authUser", JSON.stringify(response));
      dispatch(loginSuccess(response));
      history("/dashboard");
    }
  } catch (error) {
    dispatch(apiError(error));
  }
};

export const resetLoginFlag = () => async (dispatch) => {
  try {
    const response = dispatch(reset_login_flag());
    return response;
  } catch (error) {
    dispatch(apiError(error));
  }
};
