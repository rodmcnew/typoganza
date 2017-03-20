import React, {Component, PropTypes} from 'react';
import PartnerLinks from './PartnerLinks'

export default class TypoList extends Component {
    render() {
        let loggedIn = this.props.authToken && this.props.authToken.length !== 0;
        return (
            <table className="table">
                <tbody>
                <tr>
                    <th>Typo Domain</th>
                    <th>Original Domain</th>
                    <th>{this.props.rankLabel}</th>
                    <th>{this.props.typos.length} Results</th>
                    {loggedIn &&
                    <td></td>
                    }
                </tr>
                {this.props.typos.map((typo, i) =>
                    <tr key={typo.name}>
                        <td>
                            <a href={PartnerLinks.getNameCheapLink(typo.name)}>
                                {typo.name}
                            </a>
                        </td>
                        <td>
                            <a href={'http://' + typo.parent}>
                                {typo.parent}
                            </a>
                        </td>
                        <td>
                            {typo.rank}
                        </td>
                        <td>
                            <a href={PartnerLinks.getNameCheapLink(typo.name)}>NameCheap</a>
                            <span>&nbsp;|&nbsp;</span>
                            {!loggedIn && /* @TODO remove this it statement if app goes public */
                            <span>
                                <a href={PartnerLinks.getDoDaddyLink(typo.name)}>GoDaddy</a>
                                <span>&nbsp;|&nbsp;</span>
                            </span>
                            }
                            <a href={PartnerLinks.getGoogleSearchLinkIgnoreYouMayAlsoMean(typo.name)}>Google</a>
                            {/*<span>&nbsp;|&nbsp;</span>*/}
                            {/*<a href={PartnerLinks.getGoogleSearchLink(typo.parent)}>GoogleOriginal</a>*/}
                            <span>&nbsp;|&nbsp;</span>
                            <a href={PartnerLinks.getAlexaLink(typo.parent)}>Alexa</a>
                            <span>&nbsp;|&nbsp;</span>
                            <a href={PartnerLinks.getDomainToolsWhoisHistoryLink(typo.name)}>History</a>
                        </td>
                        {loggedIn &&
                        <td>
                            {/* @TODO Use react rather than easy-ajax-button */}
                            <button className="btn btn-default btn-xs"
                                    data-easy-ajax-button-method="PUT"
                                    data-easy-ajax-button-url={'/api/typo/recheck-needed/' + typo.name + '?authorization=' + this.props.authToken}
                                    data-easy-ajax-button-done-message={'Marked for recheck'}>
                                Recheck
                            </button>
                            <span>&nbsp;</span>
                            <button className="btn btn-default btn-xs"
                                    data-easy-ajax-button-method="PUT"
                                    data-easy-ajax-button-url={'/api/hidden-parents/_current-user_/' + typo.parent + '?authorization=' + this.props.authToken}
                                    data-easy-ajax-button-confirm-message={'Hide all typos from the original domain ' + typo.parent + ' in the future?'}
                                    data-easy-ajax-button-done-message={'Hidden in future'}>
                                Hide
                            </button>
                        </td>
                        }
                    </tr>
                )}
                </tbody>
            </table>
        );
    }
}

TypoList.propTypes = {
    rankLabel: PropTypes.string.isRequired,
    typos: PropTypes.array.isRequired,
    authToken: PropTypes.string
};

