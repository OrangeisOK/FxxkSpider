import * as React from "react";
import Axios from "axios";
import { UserContext } from "./userContext";
import { RouteChildrenProps } from "react-router";

class LogoutContainer extends React.Component<RouteChildrenProps> {
    public static contextType = UserContext;

    public componentDidMount() {
        if (this.context.userInfo.loginStatus) {
            this.context.setLoginStatus(false);
            Axios.post("/api/logout")
                .then(() => location.href = "/login");
        } else {
            location.href = "/login";
        }
    }

    public render() {
        return "";
    }
}

export default LogoutContainer;
