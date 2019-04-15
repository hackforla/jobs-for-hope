import React, { Component } from "react";
import { loadRequests, approveRequest } from "../services/verify-service";


class Account extends Component {
	constructor(props) {
		super(props);
		this.state = {
			requests: []
		}
	}
	componentDidMount() {
		loadRequests().then(result => this.setState({ requests: result }));
	}

	approveReq = (e) => {
		approveRequest(e.target.dataset.email).then(result => {
				this.setState((prevState) => ({
					requests: prevState.requests.filter(item => item.email !== result)
				}));
		})
	}

	render() {
		const { role, organization } = this.props.activeUser;
		const { requests } = this.state;
		return (
			<div className="account-container">
			  { role !== 'pending' ?
				  <h1>{`Viewing account page for ${organization}`}</h1>
				  :
				  <h1>You are not currently approved to post jobs or edit site information. Please contact the site's admin for approval. 
				  </h1>
			  }
			  { role === 'admin' ? <h2>Pending Requests:</h2> : null }
			  { role === 'admin' && requests.length > 0 ?
			  	requests.map((item, i) => {
				  	return (
				  		<div className="request-container" key={i}>
				  			<div className="request-item">
				  				{item.email}
				  			</div>
				  			<div className="request-item">
				  				{item.organization}
				  			</div>
				  			<div className="request-item">
				  				<button
				  					data-email={item.email} 
				  					onClick={this.approveReq}>
				  					Approve
				  				</button>
				  			</div>
				  		</div>
				  		);
				  })
				  :
				  null
			  }
			</div>
		)
	}
}

export default Account;