import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Linking, View, Text, Image, TouchableOpacity } from 'react-native';
import { Button, Icon } from 'native-base';

import PageTitle from '../../../../components/Content/PageTitle';

import styles from '../../../../styles';

export default function AgencyView({ agency, hideSeparator, goToAgency }) {


    const getUrl = link => {
        return link.includes('http') ? link : `http://${link}`;
    };

    return (
        <View style={[styles.sectionContainer], { marginTop: 20, marginLeft: 10, marginRight: 10 }}>
            <View style={{ marginTop: 20 }}>
                {
                    agency.image && agency.image.url !== ''
                    ? (
                        <View style={{ width: '80%', marginRight: 'auto', marginLeft: 'auto', marginBottom: 20, padding: 15, backgroundColor: '#4D4D4D', borderRadius: 20 }}>
                            <Image
                                style={{ maxWidth: '100%', aspectRatio: 1, resizeMode: 'contain' }}
                                source={{
                                    uri: agency.image.url,
                                }}
                            />
                        </View>
                    )
                    : <PageTitle><Fragment>{agency.nom}</Fragment></PageTitle>
                }
            </View>
            <View style={{ marginTop: 30, marginLeft: 40 }}>
                {agency.google_map && <View style={{ flex: 2 }}><Text onPress={() => Linking.openURL(agency.google_map)} style={{ marginBottom: 15 }}><Icon type="FontAwesome5" name="map-marker-alt" style={{ fontSize: 18 }} />{'      '}{agency.adresse} {agency.code_postal} {agency.ville}</Text></View>}
                {agency.telephone && <Text onPress={() => Linking.openURL(`tel:${agency.telephone}`)} style={{ marginBottom: 15 }}><Icon type="FontAwesome5" name="phone" style={{ fontSize: 18 }} />{'      '}{agency.telephone}</Text>}
                {agency.mail_ && <Text onPress={() => Linking.openURL(`mailto:${agency.mail_}`)} style={{ marginBottom: 15 }}><Icon type="FontAwesome5" name="envelope" style={{ fontSize: 18 }} />{'      '}{agency.mail_}</Text>}
                {agency.site_web && <Text onPress={() => Linking.openURL(getUrl(agency.site_web))} style={{ marginBottom: 15 }}><Icon type="FontAwesome5" name="globe" style={{ fontSize: 18 }} />{'      '}{agency.site_web}</Text>}
            </View>
            <View style={{ marginTop: 30 }}>
                {agency.demande_en_ligne && <Button light block onPress={() => Linking.openURL(getUrl(agency.demande_en_ligne))} style={{ marginTop: 20, textAlign: 'center' }}><Text style={{ }}>Je veux être rappelé</Text></Button>}
            </View>
        </View>
    );
}

AgencyView.defaultProps = {
    hideSeparator: false,
};

AgencyView.propTypes = {
    agency: PropTypes.object.isRequired,
    hideSeparator: PropTypes.bool,
    goToAgency: PropTypes.func.isRequired,
};
