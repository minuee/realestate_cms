import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { useQuery } from "react-query";
import { Auth, UserState } from "@psyrenpark/auth";
import { useRecoilState } from "recoil";
import { authState } from "state";

import Dashboard from "./layouts";
import { SignIn } from "./pages/Auth";
import { CustomerList, CustomerDetail } from "./pages/Admin/Customer";
import { DealerList, DealerDetail } from "./pages/Admin/Dealer";
import { HouseList, HouseDetail } from "./pages/Admin/House";
import { CommunityFeedList, CommunityFeedDetail } from "./pages/Admin/Community";
import { HouseCommunityList, HouseFeedList, HouseFeedDetail } from "./pages/Admin/HouseCommunity";
import { SubscribeList, SubscribeDetail } from "./pages/Admin/Subscribe";
import { ServiceDetail } from "./pages/Admin/Service";
import { PrivacyDetail } from "./pages/Admin/Privacy";
import { InquiryList, InquiryDetail } from "./pages/Admin/Inquiry";
import { ReportList } from "./pages/Admin/Report";

export default () => {
  const [auth, setAuth] = useRecoilState(authState);
  const {} = useQuery("auth", async () => {
    try {
      await Auth.currentSession();
    } catch (e) {
      setAuth(UserState.NOT_SIGN);
    }
  });

  return <BrowserRouter>{auth == "SIGNED" ? <AdminRoutes /> : <AuthRoutes />}</BrowserRouter>;
};

const AuthRoutes = () => {
  return (
    <Switch>
      <Route path="/signin" component={SignIn} />
      <Redirect to="/signin" />
    </Switch>
  );
};

const AdminRoutes = () => {
  return (
    <Dashboard>
      <Switch>
        <Route exact path="/member/customer/:member_pk" component={CustomerDetail} />
        <Route path="/member/customer" component={CustomerList} />
        <Route exact path="/member/dealer/:member_pk" component={DealerDetail} />
        <Route path="/member/dealer" component={DealerList} />
        <Redirect from="/member" to="/member/customer" />

        <Route exact path="/house/:apart_code/:fast_deal_pk" component={HouseDetail} />
        <Route path="/house" component={HouseList} />

        <Route exact path="/community/:estate_story_pk" component={CommunityFeedDetail} />
        <Route path="/community" component={CommunityFeedList} />

        <Route exact path="/house_community/:apart_code/:apart_story_pk" component={HouseFeedDetail} />
        <Route path="/house_community/:apart_code" component={HouseFeedList} />
        <Route path="/house_community" component={HouseCommunityList} />

        <Route exact path="/subscribe/:settlement_pk" component={SubscribeDetail} />
        <Route path="/subscribe" component={SubscribeList} />

        <Route exact path="/service" component={ServiceDetail} />

        <Route exact path="/privacy" component={PrivacyDetail} />

        <Route exact path="/inquiry/:inquiry_pk" component={InquiryDetail} />
        <Route path="/inquiry" component={InquiryList} />

        <Route path="/report" component={ReportList} />

        <Redirect to="/member/customer" />
      </Switch>
    </Dashboard>
  );
};
