import React, {Component, PropTypes} from 'react';
import TypoList from './TypoList';
import NavBar from './NavBar'

export default class App extends Component {
    render() {
        return (
            <div>
                <NavBar currentNavLink={this.props.currentNavLink} authToken={this.props.authToken}/>
                <div className="container">
                    <h1>{this.props.listTitle}</h1>
                    <p>Domains that have empty DNS and WHOIS records are listed below. Click
                        a
                        registrar to do a deeper availability check. This list
                        is scanned and updated daily.</p>
                    <TypoList rankLabel={this.props.rankLabel} typos={this.props.typos} authToken={this.props.authToken}/>
                </div>
            </div>
        );
    }
}

App.propTypes = {
    rankLabel: PropTypes.string.isRequired,
    typos: PropTypes.array.isRequired,
    listTitle: PropTypes.string.isRequired,
    currentNavLink: PropTypes.string.isRequired,
    authToken: PropTypes.string
};
