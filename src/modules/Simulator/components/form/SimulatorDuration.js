import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, View, Keyboard } from 'react-native';
import { Content, Footer, FooterTab, H2, H3, Form, Item, Label, Text, Input, Button, Icon } from 'native-base';

import AgenciesList from '../../../Agency/components/list/AgenciesList';

import styles from '../../../../styles';

export default class SimulatorDuration extends Component {

    constructor(props) {
        super(props);

        this.state = {
            department: props.department || null,
            amount: null,
            rate: null,
            loan: null,
            duration: null,
        };

        this.handleCalculation = this.handleCalculation.bind(this);
    }

    handleChange(name, value) {
        this.setState({
            [name]: value,
        });
    }

    // M = loan
    // T = rate
    // m = amount
    // n = duration = ln ( - M / ( T / 12 x m – M) / ln ( 1 + T / 12 )
    handleCalculation(event) {
        const { department, amount } = this.state;
        const rate = parseFloat((this.state.rate || '').replace(',', '.'));
        const loan = parseFloat((this.state.loan || '').replace(',', '.'));

        if(department && amount && rate && loan) {
            console.log(amount, rate, loan, -loan, ((rate / 12) * amount), -loan / ((rate / 12) * amount) - loan, Math.log((-loan / ((rate / 12) * amount) - loan) / Math.log(1 + rate / 12)));

            const duration = Math.log(-loan / ((rate / 100) / 12 * parseFloat(amount) - loan)) / Math.log(1 + (rate / 100) / 12);
            // const duration = Math.log((-loan / ((rate / 12) * amount) - loan) / Math.log(1 + rate / 12));
            console.log('result', duration);

            this.setState({
                duration: `${Math.floor(duration)}`.replace('.', ','),
            }, () => Keyboard.dismiss());
        } else {
            this.setState({
                department: department || '',
                amount: amount || '',
                rate: rate || '',
                loan: loan || '',
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
                        <View style={styles.sectionTitle}>
                            <H2 style={{ textAlign: 'center' }}>Durée</H2>
                        </View>
                        {
                            this.state.duration !== null
                            ? (
                                <View style={styles.sectionTitle}>
                                    <H3 style={[styles.center, { marginBottom: 35 }]}>Durée du prêt</H3>
                                    {
                                        parseFloat(this.state.duration) > 0
                                        ? <Text style={[styles.center, styles.infoText, { fontSize: 35 }]}>{`${this.state.duration} mois`}</Text>
                                        : <Text style={[styles.dangerText, styles.center]}>La durée de remboursement excède : 30 ans ! Votre mensualité est trop faible.</Text>
                                    }

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
                                            error={!this.state.loan && this.state.loan !== null}
                                            style={styles.inputContainer}
                                        >
                                            <Label>Montant de la mensualité</Label>
                                            <Input
                                                value={this.state.loan}
                                                maxLength={6}
                                                onChangeText={text => this.handleChange('loan', text)}
                                                keyboardType="decimal-pad"
                                            />
                                        </Item>
                                        {!this.state.loan && this.state.loan !== null && <Text style={[styles.center, styles.dangerText]}><Icon type="FontAwesome5" name="info-circle" style={[styles.dangerText, { fontSize: 15 }]} /> Veuillez renseigner la mensualité</Text>}
                                    </Form>

                                </View>
                            )
                        }
                    </View>
                </Content>
                {
                    this.state.duration !== null
                    ? (
                        <Footer style={styles.footerContainer}>
                            <FooterTab style={styles.footerTabContainer}>
                                <Button onPress={() => this.setState({ duration: null })} light transparent vertical><Icon type="FontAwesome5" name="undo" /><Text>Recalculer</Text></Button>
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

SimulatorDuration.defaultProps = {
    title: null,
    department: null,
    closeForm: () => {},
};

SimulatorDuration.propTypes = {
    title: PropTypes.node,
    department: PropTypes.string,
    setDepartment: PropTypes.func.isRequired,
    // goToAgencies: PropTypes.func.isRequired,
    closeForm: PropTypes.func,
};
