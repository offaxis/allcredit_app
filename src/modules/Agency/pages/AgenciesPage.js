import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Content, View, Text, Form, Item, Label, Input, Button, Alert, Icon } from 'native-base';

import { setPreferedDepartment, getPreferedDepartment } from '../../User/UserActions';

import styles from '../../../styles';
import PageTitle from '../../../components/Content/PageTitle';
import NavigationBottom from '../../App/components/navigation/NavigationBottom';
import AgenciesList from '../components/list/AgenciesList';


class AgenciesPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            department: props.match.params.department || props.preferedDepartment,
            hasSearched: props.match.params.department || false,
        };

        this.handleSetDepartment = this.handleSetDepartment.bind(this);
    }

    handleChange(name, value) {
        this.setState({
            [name]: value,
        });
    }

    handleSetDepartment() {
        if(this.state.department) {
            this.props.dispatch(setPreferedDepartment(this.state.department));
            this.setState({
                // department
                hasSearched: true,
            });
        }
    }

    renderTitle() {
        if(this.state.hasSearched) {
            return <Fragment>Nos agences</Fragment>;
        }
        return <Fragment>Trouver une agence</Fragment>;
    }

    renderResults() {
        return <AgenciesList department={this.state.department} />;
    }

    render() {
        return (
            <Fragment>
                <Content>
                    <View>
                        <PageTitle>
                            {this.renderTitle()}
                        </PageTitle>

                        <View>
                            <Form style={[styles.sectionContainer, { flexDirection: 'row' }]}>
                                <Item
                                    floatingLabel
                                    error={!this.state.department && this.state.department !== null}
                                    style={[styles.inputContainer, { flex: 4 }]}
                                >
                                    <Label>Département</Label>
                                    <Input
                                        value={this.state.department}
                                        maxLength={2}
                                        onChangeText={text => this.handleChange('department', text)}
                                        keyboardType="numeric"
                                    />
                                </Item>
                                <Button disabled={!this.state.department} onPress={this.handleSetDepartment} transparent style={[{ flex: 1, marginTop: 20, textAlign: 'center' }]}><Icon type="FontAwesome5" name="check-circle" style={styles.successText} /></Button>
                            </Form>
                        </View>

                        {
                            this.state.hasSearched
                            ? this.renderResults()
                            : <Text style={{ marginTop: 10, textAlign: 'center', fontSize: 12, fontStyle: 'italic' }}>Veuillez effectuer votre recherche par département</Text>
                        }

                    </View>
                </Content>
                <NavigationBottom />
            </Fragment>
        );
    }

}

function mapStateToProps(store, props) {
    const preferedDepartment = getPreferedDepartment(store);
    return {
        preferedDepartment,
    };
}

AgenciesPage.defaultProps = {
    preferedDepartment: null,
    agency: null,
};

AgenciesPage.propTypes = {
    dispatch: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    preferedDepartment: PropTypes.string,
    agency: PropTypes.object,
};

export default connect(mapStateToProps)(AgenciesPage);
