import React, {Component, PropTypes} from 'react';
import NavLink from './NavLink'

export default class NavBar extends Component {
    render() {
        return (
            <nav className="navbar navbar-inverse bg-inverse">
                <div className="container">
                    <div className="navbar-header">
                        <a className="navbar-brand" href="/">Typoganza</a>
                    </div>
                    <ul className="nav navbar-nav">
                        <NavLink text="Alexa Top 250"
                                 href="/available-typo-domains/alexa/top/250"
                                 currentUrl={this.props.currentNavLink}
                                 authToken={this.props.authToken}/>
                        <NavLink text="Alexa Top 500"
                                 href="/available-typo-domains/alexa/top/500"
                                 currentUrl={this.props.currentNavLink}
                                 authToken={this.props.authToken}/>
                        <NavLink text="Alexa Top 1000"
                                 href="/available-typo-domains/alexa/top/1000"
                                 currentUrl={this.props.currentNavLink}
                                 authToken={this.props.authToken}/>
                        <NavLink text="CJ 5 Star"
                                 href="/available-typo-domains/cj/star-rating/5"
                                 currentUrl={this.props.currentNavLink}
                                 authToken={this.props.authToken}/>
                        <NavLink text="CJ 4 Star"
                                 href="/available-typo-domains/cj/star-rating/4"
                                 currentUrl={this.props.currentNavLink}
                                 authToken={this.props.authToken}/>
                        <NavLink text="CJ 3 Star"
                                 href="/available-typo-domains/cj/star-rating/3"
                                 currentUrl={this.props.currentNavLink}
                                 authToken={this.props.authToken}/>
                        <NavLink text="CJ Top 1000"
                                 href="/available-typo-domains/cj/top/1000"
                                 currentUrl={this.props.currentNavLink}
                                 authToken={this.props.authToken}/>
                    </ul>
                </div>
            </nav>
        );
    }
}

NavBar.propTypes = {
    currentNavLink: PropTypes.string.isRequired,
    authToken: PropTypes.string
};
