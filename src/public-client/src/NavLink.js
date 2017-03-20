import React, {Component, PropTypes} from 'react';

export default class NavLink extends Component {
    render() {
        let linkAppend = '';
        if (this.props.authToken && this.props.authToken.length !== 0) {
            linkAppend = '?authorization=' + this.props.authToken;
        }
        return (
            <li className={this.props.currentUrl === this.props.href ? 'active' : ''}>
                <a href={this.props.href + linkAppend}>{this.props.text}</a>
            </li>
        );
    }
}

NavLink.propTypes = {
    text: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired,
    currentUrl: PropTypes.string.isRequired,
    authToken: PropTypes.string.isRequired
};
