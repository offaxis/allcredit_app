import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar } from 'react-native';
import { Link } from 'react-router-native';

import { StyleProvider, Container, Content } from 'native-base';
import getTheme from '../../native-base-theme/components';

// import customTheme from '../../theme';
// import styles from '../../styles';


export default function AppWrapper({ children }) {
    return (
        <Fragment>
            <StatusBar barStyle="light-content" />

            <StyleProvider style={getTheme()}>
                <Container>
                    {children}
                </Container>
            </StyleProvider>
        </Fragment>
    );
}


// <SafeAreaView style={[styles.body]}>
//     <ScrollView
//         contentInsetAdjustmentBehavior="automatic"
//         style={styles.scrollView}
//     >
//         <ThemeProvider theme={customTheme}>
//             {children}
//         </ThemeProvider>
//     </ScrollView>
//
// </SafeAreaView>


AppWrapper.defaultProps = {
    children: null,
};

AppWrapper.propTypes = {
    children: PropTypes.node,
};
