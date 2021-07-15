import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, View, Keyboard } from 'react-native';
import { Content, Footer, FooterTab, H2, H3, Form, Segment, Item, Label, Text, Input, Button, Icon } from 'native-base';

import { callExternalApi } from '../../../../util/apiCaller';

import AgenciesList from '../../../Agency/components/list/AgenciesList';

import styles from '../../../../styles';

export default class SimulatorNotaryFees extends Component {

    constructor(props) {
        super(props);

        this.state = {
            department: props.department || null,
            price: null,
            isNew: false,
            tenantFees: [],
            fee: null,
        };

        this.handleCalculation = this.handleCalculation.bind(this);
    }

    componentDidMount() {
        callExternalApi('http://test.allcredit.fr/notaire.json',
            // , 'post', {
            //     fees: [
            //         {
            //             max: 60000,
            //             fixed: 405.410,
            //             percent: 0.814,
            //         },
            //         {
            //             max: 17000,
            //             fixed: 242.810,
            //             percent: 1.085,
            //         },
            //         {
            //             max: 6500,
            //             fixed: 150.670,
            //             percent: 1.627,
            //         },
            //         {
            //             max: 0,
            //             fixed: 0,
            //             percent: 3.945,
            //         },
            //     ],
            // }
        ).then(result => {
            console.log(result);
            if(result.alc_emolu) {
                this.setState({
                    tenantFees: result.alc_emolu,
                });
            }
        });
    }

    getTenantFee(price) {
        let fee = null;
        this.state.tenantFees.forEach((tenantFee, index) => {
            if(!fee) {
                if(price <= parseFloat(tenantFee.max_euro) || (index + 1) === this.state.tenantFees.length) {
                    // console.log('Tenant fee found', price, tenantFee.max_euro, parseFloat(tenantFee.max_euro), price >= parseFloat(tenantFee.max_euro), (index + 1) === this.state.tenantFees.length);
                    fee = tenantFee;
                }
            }
        });
        return fee || {};
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
        const { department, isNew, price } = this.state;

        if(department && price) {
            console.log(price, isNew);

            // let tenantFeesFixed = 0;
            // let tenantFeesPercent = 3.945;
            // if(price >= 60000) {
            //     tenantFeesFixed = 405.410;
            //     tenantFeesPercent = 0.814;
            // } else if(price >= 17000) {
            //     tenantFeesFixed = 242.810;
            //     tenantFeesPercent = 1.085;
            // } else if(price >= 6500) {
            //     tenantFeesFixed = 150.670;
            //     tenantFeesPercent = 1.627;
            // }
            const { montant, pourcentage } = this.getTenantFee(price);
            console.log('Tenand fee fetched', { montant, pourcentage });

            let fee = (
                (
                    (parseFloat(price) * parseFloat(pourcentage))
                    / 100
                ) + parseFloat(montant) + 850
            ) * 1.2;
            // F = (
            //     (
            //         (P*Te)
            //         / 100
            //     ) + p + 850
            // ) * 1.2;

            if(isNew) {
                fee += (parseFloat(price) * 0.715) / 100;
                //     F = F+((P*0.715)/100);
            } else {
                fee += (parseFloat(price) * 5.8067) / 100;
                //     F = F+((P*5.8067)/100);
            }

            fee += ((parseFloat(price) * 0.1) / 100) + 50;
            // F = F+((P*0.10)/100)+50;


            this.setState({
                fee: `${Math.floor((fee) * 100) / 100}`.replace('.', ','),
            }, () => Keyboard.dismiss());
        } else {
            this.setState({
                department: department || '',
                isNew: isNew || false,
                price: price || '',
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
                            <H2 style={{ textAlign: 'center' }}>Frais de notaire</H2>
                        </View>
                        {
                            this.state.fee !== null
                            ? (
                                <View style={styles.sectionTitle}>
                                    <H3 style={[styles.center, { marginTop: 35 }]}>Montant:</H3>
                                    <Text style={[styles.center, styles.infoText, { fontSize: 35 }]}>{`${this.state.fee}€ `}</Text>

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

                                        <View
                                            style={styles.inputContainer}
                                        >
                                            <Label>Type de bien</Label>
                                            <View style={{
                                                flex: 1,
                                                flexDirection: 'row',
                                                justifyContent: 'center',
                                                alignItems: 'stretch',
                                                paddingTop: 10,
                                                textAlign: 'center',
                                            }}
                                            >
                                                <Button block transparent={this.state.isNew} info={!this.state.isNew} style={[{ width: '50%', maxWidth: 200 }]} onPress={() => this.setState({ isNew: false })}><Text>Ancien</Text></Button>
                                                <Button block transparent={!this.state.isNew} info={this.state.isNew} style={{ width: '50%', maxWidth: 200 }} onPress={() => this.setState({ isNew: true })}><Text>Neuf</Text></Button>
                                            </View>
                                        </View>

                                        <Item
                                            floatingLabel
                                            error={!this.state.price && this.state.price !== null}
                                            style={styles.inputContainer}
                                        >
                                            <Label>{'Prix d\'achat hors taxe'}</Label>
                                            <Input
                                                value={this.state.price}
                                                maxLength={6}
                                                onChangeText={text => this.handleChange('price', text)}
                                                keyboardType="numeric"
                                            />
                                        </Item>
                                        {!this.state.price && this.state.price !== null && <Text style={[styles.center, styles.dangerText]}><Icon type="FontAwesome5" name="info-circle" style={[styles.dangerText, { fontSize: 15 }]} /> {'Veuillez renseigner le prix d\'achat'}</Text>}

                                    </Form>

                                </View>
                            )
                        }
                    </View>
                </Content>

                {
                    this.state.fee !== null
                    ? (
                        <Footer style={styles.footerContainer}>
                            <FooterTab style={styles.footerTabContainer}>
                                <Button onPress={() => this.setState({ fee: null })} light transparent vertical><Icon type="FontAwesome5" name="undo" /><Text>Recalculer</Text></Button>
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

SimulatorNotaryFees.defaultProps = {
    department: null,
    closeForm: () => {},
};

SimulatorNotaryFees.propTypes = {
    department: PropTypes.string,
    setDepartment: PropTypes.func.isRequired,
    goToAgencies: PropTypes.func.isRequired,
    closeForm: PropTypes.func,
};
