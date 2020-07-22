import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { View } from 'react-native';
import { Footer, FooterTab, Text, Button, Icon } from 'native-base';

import styles from '../../../../styles';

export default function NavigationBottom(props) {

    const history = useHistory();

    const handleBackHome = () => {
        history.push('/');
    };

    const handleGoPage = () => {
        history.push(`/page/${props.infoNav || 'about-us'}`);
    };

    const renderInfoNav = () => {
        let text = `${props.infoNav || ''}`.replace('-', ' ');
        switch(props.infoNav) {

            case 'legal-mention':
                text = 'Mentions légales';
                break;

            case 'about-us':
            default:
                text = 'À propos';

        }
        return <Button onPress={handleGoPage} light transparent><Icon type="FontAwesome5" name="info-circle" /><Text>{text}</Text></Button>;
    };

    return (
        <Footer style={styles.footerContainer}>
            <FooterTab style={styles.footerTabContainer}>
                {props.onBack && (<Button onPress={props.onBack} light transparent><Icon type="FontAwesome5" name="chevron-left" /><Text>Retour</Text></Button>)}
                {!props.hideHomeNav && <Button onPress={handleBackHome} light transparent><Icon type="FontAwesome5" name={`chevron-${props.onBack ? 'right' : 'left'}`} /><Text>Accueil</Text></Button>}
                {renderInfoNav()}
            </FooterTab>
        </Footer>

        // <View style={{
        //     flex: 1,
        //     position: 'absolute', // Here is the trick
        //     bottom: 0, // Here is the trick
        //     }}
        // >
        //     {props.onBack && (<Button onPress={props.onBack} light transparent><Icon type="FontAwesome5" name="chevron-left" /><Text>Retour</Text></Button>)}
        //     {!props.hideHomeNav && <Button onPress={handleBackHome} light transparent><Icon type="FontAwesome5" name={`chevron-${props.onBack ? 'right' : 'left'}`} /><Text>Accueil</Text></Button>}
        //     {renderInfoNav()}
        // </View>
    );
}

NavigationBottom.defaultProps = {
    onBack: null,
    hideHomeNav: false,
    infoNav: null,
};

NavigationBottom.propTypes = {
    onBack: PropTypes.func,
    hideHomeNav: PropTypes.bool,
    infoNav: PropTypes.string,
};
