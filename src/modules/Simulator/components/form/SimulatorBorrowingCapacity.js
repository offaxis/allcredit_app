import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, View, Keyboard } from 'react-native';
import { Content, Footer, FooterTab, H2, H3, Form, Item, Label, Text, Input, Button, Icon } from 'native-base';

import AgenciesList from '../../../Agency/components/list/AgenciesList';

import styles from '../../../../styles';

export default class SimulatorBorrowingCapacity extends Component {

    constructor(props) {
        super(props);

        this.state = {
            department: props.department || null,
            loan: null,
            rate: null,
            duration: null,
            amount: null,
        };

        this.handleCalculation = this.handleCalculation.bind(this);
    }

    handleChange(name, value) {
        this.setState({
            [name]: value,
        });
    }

    // m = loan
    // T = rate
    // n = duration
    // M = amount = m x ( 1 – ( 1 + T / 12 ) ^ ( - n ) ) / ( T / 12 )
    handleCalculation(event) {
        const { department, loan, duration } = this.state;
        const rate = (this.state.rate || '').replace(',', '.');

        if(department && loan && rate && duration) {
            console.log(loan, rate, duration);

            const amount = loan * (1 - Math.pow((1 + ((rate / 100) / 12)), -(duration * 12))) / ((rate / 100) / 12);
            console.log(amount);

            this.setState({
                amount: `${Math.floor((amount) * 100) / 100}`.replace('.', ','),
            }, () => Keyboard.dismiss());
        } else {
            this.setState({
                department: department || '',
                loan: loan || '',
                rate: rate || '',
                duration: duration || '',
            });
        }

        // Set prefered department
        if(department && this.props.setDepartment) {
            this.props.setDepartment(department);
        }
    }

    render() {
        return (
            <Fragment>
                <Content>
                    {this.props.title}
                    <View style={styles.sectionContainer}>
                        <View>
                            <H2 style={{ textAlign: 'center' }}>{'Capacité d\'emprunt'}</H2>
                        </View>
                        {
                            this.state.amount !== null
                            ? (
                                <View style={styles.sectionTitle}>
                                    <H3 style={[styles.center, { marginBottom: 35 }]}>{`Durée du prêt: ${this.state.duration} an${this.state.duration > 1 ? 's' : ''}`}</H3>
                                    <H2 style={styles.center}>Capital empruntable:</H2>
                                    <Text style={[styles.center, styles.infoText, { fontSize: 35 }]}>{`${this.state.amount}€ `}</Text>

                                    <AgenciesList department={this.state.department} displayTitle />
                                </View>
                            )
                            : (
                                <View>
                                    <Form style={styles.sectionContainer}>
                                        <Item
                                            floatingLabel
                                            error={!this.state.department && this.state.department !== null}
                                            style={styles.inputContainer}
                                        >
                                            <Label>Département</Label>
                                            <Input
                                                value={this.state.department}
                                                maxLength={2}
                                                onChangeText={text => this.handleChange('department', text)}
                                                keyboardType="numeric"
                                            />
                                        </Item>
                                        {!this.state.department && this.state.department !== null && <Text style={[styles.center, styles.dangerText]}><Icon type="FontAwesome5" name="info-circle" style={[styles.dangerText, { fontSize: 15 }]} /> Veuillez renseigner votre département</Text>}
                                        <Item
                                            floatingLabel
                                            error={!this.state.loan && this.state.loan !== null}
                                            style={styles.inputContainer}
                                        >
                                            <Label>Montant de la mensualité souhaité</Label>
                                            <Input
                                                value={this.state.loan}
                                                maxLength={4}
                                                onChangeText={text => this.handleChange('loan', text)}
                                                keyboardType="numeric"
                                            />
                                        </Item>
                                        {!this.state.loan && this.state.loan !== null && <Text style={[styles.center, styles.dangerText]}><Icon type="FontAwesome5" name="info-circle" style={[styles.dangerText, { fontSize: 15 }]} /> Veuillez renseigner le montant du prêt</Text>}
                                        <Item
                                            floatingLabel
                                            error={!this.state.rate && this.state.rate !== null}
                                            style={styles.inputContainer}
                                        >
                                            <Label>Taux annuel avec assurance</Label>
                                            <Input
                                                value={this.state.rate}
                                                maxLength={5}
                                                onChangeText={text => this.handleChange('rate', text)}
                                                keyboardType="decimal-pad"
                                            />
                                        </Item>
                                        {!this.state.rate && this.state.rate !== null && <Text style={[styles.center, styles.dangerText]}><Icon type="FontAwesome5" name="info-circle" style={[styles.dangerText, { fontSize: 15 }]} /> {'Veuillez renseigner le taux d\'emprunt'}</Text>}

                                        <Item
                                            floatingLabel
                                            error={!this.state.duration && this.state.duration !== null}
                                            style={styles.inputContainer}
                                        >
                                            <Label>Durée en année</Label>
                                            <Input
                                                value={this.state.duration}
                                                maxLength={3}
                                                onChangeText={text => this.handleChange('duration', text)}
                                                keyboardType="decimal-pad"
                                            />
                                        </Item>
                                        {!this.state.duration && this.state.duration !== null && <Text style={[styles.center, styles.dangerText]}><Icon type="FontAwesome5" name="info-circle" style={[styles.dangerText, { fontSize: 15 }]} /> Veuillez renseigner la durée du prêt</Text>}
                                    </Form>

                                </View>
                            )
                        }
                    </View>
                </Content>

                {
                    this.state.amount !== null
                    ? (
                        <Footer style={styles.footerContainer}>
                            <FooterTab style={styles.footerTabContainer}>
                                <Button onPress={() => this.setState({ amount: null })} light transparent vertical><Icon type="FontAwesome5" name="undo" /><Text>Recalculer</Text></Button>
                                {/* <Button onPress={this.props.goToAgencies} success vertical><Icon type="FontAwesome5" name="chevron-right" style={{ color: '#fff', marginBottom: 5 }} /><Text style={{ color: '#fff' }}>Trouver un financement</Text></Button> */}
                            </FooterTab>
                        </Footer>
                    )
                    : (
                        <Footer style={styles.footerContainer}>
                            <FooterTab style={styles.footerTabContainer}>
                                {this.props.closeForm && (<Button onPress={this.props.closeForm} light transparent vertical><Icon type="FontAwesome5" name="chevron-left" /><Text>Retour</Text></Button>)}
                                <Button onPress={this.handleCalculation} success vertical><Icon type="FontAwesome5" name="calculator" style={{ color: '#fff', marginBottom: 5 }} /><Text style={{ color: '#fff' }}>Calculer</Text></Button>
                            </FooterTab>
                        </Footer>
                    )
                }
            </Fragment>
        );
    }

}

SimulatorBorrowingCapacity.defaultProps = {
    department: null,
    closeForm: () => {},
};

SimulatorBorrowingCapacity.propTypes = {
    department: PropTypes.string,
    setDepartment: PropTypes.func.isRequired,
    goToAgencies: PropTypes.func.isRequired,
    closeForm: PropTypes.func,
};
