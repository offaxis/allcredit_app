import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, View, Keyboard } from 'react-native';
import { Content, Footer, FooterTab, H2, H3, Form, Item, Label, Text, Input, Button, Icon } from 'native-base';

import AgenciesList from '../../../Agency/components/list/AgenciesList';

import styles from '../../../../styles';

export default class SimulatorMonthlyLoan extends Component {

    constructor(props) {
        super(props);

        this.state = {
            department: props.department || null,
            amount: null,
            rate: null,
            duration: null,
            loan: null,
        };

        this.handleCalculation = this.handleCalculation.bind(this);
    }

    handleChange(name, value) {
        this.setState({
            [name]: value,
        });
    }


    // m = amount
    // T = rate
    // n = duration
    // M = loan = ( m x T ) / 1 – ( 1 + T ) ^( -n )
    handleCalculation(event) {
        const { department, amount, duration } = this.state;
        const rate = parseFloat((this.state.rate || '').replace(',', '.'));

        if(department && amount && rate && duration) {
            console.log(amount, rate, duration);

            // old : (((amount * rate) / 1 - (1 + rate) ** -(duration)) / duration)
            const loan = ((parseFloat(amount) * (rate / 100)) / 12) / (1 - Math.pow((1 + ((rate / 100) / 12)), -(parseInt(duration, 10) * 12)));
            console.log(loan);

            this.setState({
                loan: `${Math.ceil(loan * 100) / 100}`.replace('.', ','),
            }, () => Keyboard.dismiss());
        } else {
            this.setState({
                department: department || '',
                amount: amount || '',
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
                                <H2 style={{ textAlign: 'center' }}>Mensualité</H2>
                            </View>
                            {
                                this.state.loan !== null
                                ? (
                                    <View style={styles.sectionTitle}>
                                        <H3 style={[styles.center, { marginBottom: 35 }]}><Text>{`Durée du prêt: ${this.state.duration} an${this.state.duration > 1 ? 's' : ''}`}</Text></H3>
                                        <Text style={styles.center}>Votre mensualité est de:</Text>
                                        <Text style={[styles.center, styles.infoText, { fontSize: 35 }]}>{`${this.state.loan}€ / mois`}</Text>

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
                                                error={!this.state.amount && this.state.amount !== null}
                                                style={styles.inputContainer}
                                            >
                                                <Label>Montant du prêt</Label>
                                                <Input
                                                    value={this.state.amount}
                                                    maxLength={6}
                                                    onChangeText={text => this.handleChange('amount', text)}
                                                    keyboardType="numeric"
                                                />
                                            </Item>
                                            {!this.state.amount && this.state.amount !== null && <Text style={[styles.center, styles.dangerText]}><Icon type="FontAwesome5" name="info-circle" style={[styles.dangerText, { fontSize: 15 }]} /> Veuillez renseigner le montant du prêt</Text>}
                                            <Item
                                                floatingLabel
                                                error={!this.state.rate && this.state.rate !== null}
                                                style={styles.inputContainer}
                                            >
                                                <Label>Taux</Label>
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
                                                    maxLength={2}
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
                        this.state.loan !== null
                        ? (
                            <Footer style={styles.footerContainer}>
                                <FooterTab style={styles.footerTabContainer}>
                                    <Button onPress={() => this.setState({ loan: null })} light transparent vertical><Icon type="FontAwesome5" name="undo" /><Text>Recalculer</Text></Button>
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

SimulatorMonthlyLoan.defaultProps = {
    department: null,
    closeForm: () => {},
};

SimulatorMonthlyLoan.propTypes = {
    department: PropTypes.string,
    setDepartment: PropTypes.func.isRequired,
    goToAgencies: PropTypes.func.isRequired,
    closeForm: PropTypes.func,
};
