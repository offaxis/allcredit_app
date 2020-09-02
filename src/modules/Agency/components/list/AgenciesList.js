import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from 'native-base';

import { getAgenciesRequest, getAgencies } from '../../AgencyActions';

import AgenciesListItem from './AgenciesListItem';
import styles from '../../../../styles';

class AgenciesList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
        };
    }

    componentDidMount() {
        this.setState({
            isLoading: true,
        });
        this.props.dispatch(getAgenciesRequest()).then(() => {
            this.setState({
                isLoading: false,
            });
        });
    }

    handleGoToAgency = agencyId => {
        this.props.history.push(`/agency/${agencyId}`);
    }

    getAgencies = () => {
        return (this.props.agencies || []).filter(agency => agency.dp === this.props.department);
    }

    render() {
        const agencies = this.getAgencies();
        return (
            <View style={[styles.sectionContainer]}>
            {
                agencies.length
                ? (
                    <View>
                        {this.props.displayTitle && (
                            <View style={{ fontSize: 14, marginBottom: 10 }}><Text>Nos agences:</Text></View>
                        )}
                        {agencies.map((agency, index) => <AgenciesListItem key={agency.id} agency={agency} goToAgency={this.handleGoToAgency} hideSeparator={index === (agencies.length - 1)} />)}
                    </View>
                )
                : (
                    <View>
                        {
                            this.state.isLoading
                            ? <Text style={{ marginTop: 10, textAlign: 'center' }}><Icon type="FontAwesome5" name="spinner" spin /></Text>
                            : <Text style={styles.center}>Aucune agence trouvée dans le department {this.props.department}...</Text>
                        }
                    </View>
                )
            }
            </View>
        );
    }

}

function mapStateToProps(store, props) {
    return {
        agencies: getAgencies(store),
    };
}

AgenciesList.defaultProps = {
    agencies: [],
    displayTitle: false,
};

AgenciesList.propTypes = {
    dispatch: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    agencies: PropTypes.arrayOf(PropTypes.object),
    department: PropTypes.string.isRequired,
    displayTitle: PropTypes.bool,
};

export default connect(mapStateToProps)(withRouter(AgenciesList));
