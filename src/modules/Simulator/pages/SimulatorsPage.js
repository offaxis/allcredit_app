import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Text, Alert } from 'react-native';
import { Content } from 'native-base';
import { Link } from 'react-router-native';

import { setPreferedDepartment, getPreferedDepartment } from '../../User/UserActions';
import { SIMULATOR_TYPES } from '../SimulatorActions';

import styles from '../../../styles';
import PageTitle from '../../../components/Content/PageTitle';
import Tiles from '../../../components/Content/Tiles';
import NavigationBottom from '../../App/components/navigation/NavigationBottom';

import SimulatorMonthlyLoan from '../components/form/SimulatorMonthlyLoan';
import SimulatorBorrowingCapacity from '../components/form/SimulatorBorrowingCapacity';
import SimulatorNotaryFees from '../components/form/SimulatorNotaryFees';
import SimulatorDuration from '../components/form/SimulatorDuration';

function SimulatorsPage(props) {

    const handlePrev = () => {
        props.history.push('/simulators');
    };

    const handleSetDepartment = department => {
        props.dispatch(setPreferedDepartment(department));
    };

    const handleGoToAgencies = () => {
        props.history.push(`/agencies/${props.preferedDepartment}`);
    };

    const renderTitle = () => {
        return (
            <PageTitle>
                <Fragment>Simulateurs</Fragment>
            </PageTitle>
        );
    };

    const renderSimulator = () => {

        const simulatorProps = {
            title: renderTitle(),
            department: props.preferedDepartment,
            setDepartment: handleSetDepartment,
            goToAgencies: handleGoToAgencies,
            closeForm: handlePrev,
        };

        switch(props.match.params.type) {

            case 'monthly-loan':
                return <SimulatorMonthlyLoan {...simulatorProps} />;

            case 'borrowing-capacity':
                return <SimulatorBorrowingCapacity {...simulatorProps} />;

            case 'notary-fees':
                return <SimulatorNotaryFees {...simulatorProps} />;

            case 'duration':
                return <SimulatorDuration {...simulatorProps} />;

            default:
                return <Tiles tiles={SIMULATOR_TYPES.map(simulator => ({ to: `/simulators/${simulator.name}`, title: simulator.displayName, ...simulator }))} />;

        }
    };

    if(props.match.params.type) {
        return renderSimulator();
    }

    return (
        <Fragment>
            <Content>
                <View>
                    {renderTitle()}
                </View>
                {renderSimulator()}
            </Content>
            <NavigationBottom />
        </Fragment>
    );
}

function mapStateToProps(store, props) {
    return {
        preferedDepartment: getPreferedDepartment(store),
    };
}

SimulatorsPage.defaultProps = {
    match: {},
    history: {},
    preferedDepartment: null,
};

SimulatorsPage.propTypes = {
    dispatch: PropTypes.func.isRequired,
    match: PropTypes.object,
    history: PropTypes.object,
    preferedDepartment: PropTypes.string,
};

export default connect(mapStateToProps)(SimulatorsPage);
