import React, { Component } from "react";
import { Redirect } from "react-router";
import { loadRequests, approveRequest } from "../services/verify-service";
import "./Account.scss";

class Account extends Component {
	constructor(props) {
		super(props);
		this.state = {
			requests: []
		};
	}
	componentDidMount() {
		loadRequests().then(result => this.setState({ requests: result }));
	}

	approveReq = e => {
		approveRequest(e.target.dataset.email).then(result => {
			this.setState(prevState => ({
				requests: prevState.requests.filter(
					item => item.email !== result
				)
			}));
		});
	};

	render() {
		const { role, email } = this.props.activeUser;
		const { requests } = this.state;
		if (!role) return <Redirect to="/" />;
		return (
			<div className="account-container">
				{role === "admin" ? (
					<h1>Admin Control Panel</h1>
				) : role !== "pending" ? (
					<h1>{`Account Dashboard for ${email}`}</h1>
				) : (
					<h1>
						You are not currently approved to post jobs or edit site
						information. Please contact the site's admin for
						approval.
					</h1>
				)}
				{role === "admin" ? <h2>Pending Requests:</h2> : null}
				{role === "admin" && requests.length > 0 ? (
					<table>
						<thead>
							<tr>
								<th className="table-header">E-mail</th>
								<th className="table-header">Organization</th>
								<th className="table-header" />
							</tr>
						</thead>
						<tbody>
							{requests.map((item, i) => {
								return (
									<tr className="request-container" key={i}>
										<td className="request-item">
											{item.email}
										</td>
										<td className="request-item">
											{item.first_org}
										</td>
										<td className="request-item">
											<button
												className="approve-btn"
												data-email={item.email}
												onClick={this.approveReq}
											>
												Approve
											</button>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				) : null}
				{role === "employer" ? (
					<div className="employer-main">
						<div className="jobs-container">
							<h2>Jobs:</h2>
						</div>
						<div className="org-info-container">
							<h2>Organization Info:</h2>
						</div>
					</div>
				) : null}
			</div>
		);
	}
}

export default Account;
