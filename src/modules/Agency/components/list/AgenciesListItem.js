import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Icon } from 'native-base';

import styles from '../../../../styles';
import separator from '../../../../assets/images/separator.png';

export default function AgenciesListItem({ agency, hideSeparator, goToAgency }) {
    return (
        <View>
            <TouchableOpacity onPress={event => goToAgency(agency.id)}>
                <View style={[styles.agencyItem, { flexDirection: 'row', flex: 1 }]}>
                    <Text style={[styles.agencyItemName, { flex: 7, textTransform: 'uppercase' }]}>{agency.nom}</Text>
                    <Text style={{ flex: 1, textAlign: 'right' }}>/</Text>
                    <Text style={{ flex: 5, textTransform: 'uppercase', textAlign: 'right' }}>{agency.lieu}</Text>
                    <Text style={{ flex: 2, textAlign: 'right' }}><Icon type="FontAwesome5" name="eye" style={[styles.infoText, { fontSize: 20 }]} /></Text>
                </View>
            </TouchableOpacity>
            {!hideSeparator && <View style={{ alignItems: 'center', marginTop: 10, marginBottom: 10 }}><Image source={separator} /></View>}
        </View>
    );
}
// {!hideSeparator && <Text style={styles.itemSeparator}>{'\n'}</Text>}

AgenciesListItem.defaultProps = {
    hideSeparator: false,
};

AgenciesListItem.propTypes = {
    agency: PropTypes.object.isRequired,
    hideSeparator: PropTypes.bool,
    goToAgency: PropTypes.func.isRequired,
};
