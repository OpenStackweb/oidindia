import React from "react";
import { connect } from "react-redux";
import Layout from "../components/Layout";
import { MyOrdersTicketsComponent } from '../components/MyOrdersTicketsComponent';

const MyTicketsPage = ({ location }) => {
    return (
        <Layout location={location}>
            <div className="container">

                <MyOrdersTicketsComponent />
            </div>
            <div className="container">
                <p>If you have registered multiple tickets for other attendees, you can assign them to the other attendees by selecting the ticket you would like to reassign, and clicking on the "Re-Assign" tab. You can then enter the email address of the other participant to assign the ticket to them.</p>
            </div>
            <div className="container">
                <div className="ticket-return-home">
                    <a href="/">Return to Homepage</a>
                </div>
            </div>
        </Layout>
    );
};

const mapStateToProps = ({ userState }) => ({
    user: userState,
});

export default connect(mapStateToProps, {})(MyTicketsPage);