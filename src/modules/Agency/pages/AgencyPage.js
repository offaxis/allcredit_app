import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Content } from 'native-base';

import { getAgenciesRequest, getAgency } from '../AgencyActions';

import NavigationBottom from '../../App/components/navigation/NavigationBottom';
import AgencyView from '../components/view/AgencyView';


class AgencyPage extends Component {

    componentDidMount() {
        !this.props.agency && this.props.dispatch(getAgenciesRequest());
    }

    render() {
        const { agency } = this.props;
        if(agency) {
            return (
                <Fragment>
                    <Content>
                        <AgencyView agency={agency} />
                    </Content>
                    <NavigationBottom onBack={() => this.props.history.push(`/agencies/${agency.dp}`)} />
                </Fragment>
            );
        }
        return null;
    }

}

function mapStateToProps(store, props) {
    return {
        agency: getAgency(store, props.match.params.id),
    };
}

AgencyPage.defaultProps = {
    agency: null,
};

AgencyPage.propTypes = {
    dispatch: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    agency: PropTypes.object,
};

export default connect(mapStateToProps)(AgencyPage);
