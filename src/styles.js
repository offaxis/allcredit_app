import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    left: {
        textAlign: 'left',
    },
    center: {
        textAlign: 'center',
    },
    right: {
        textAlign: 'right',
    },
    dangerText: {
        color: '#d9534f',
    },
    successText: {
        color: '#5cb85c',
    },
    infoText: {
        color: '#217cd0',
    },
    scrollView: {
        backgroundColor: '#fff',
    },
    body: {
        fontFamily: 'AvenirLTStd-Medium',
    },
    specialFont: {
        fontFamily: 'Akaju',
        fontWeight: 'normal',
    },
    tilesWrapper: {
        marginLeft: 30,
        marginRight: 30,
        marginTop: 15,
        marginBottom: 15,
    },
    tileWrapper: {
        flex: 1,
        flexDirection: 'column',
    },
    tile: {
        margin: 5,
        padding: 10,
        borderRadius: 20,
        backgroundColor: '#808080',
        color: '#fff',
    },
    tileAlt: {
        backgroundColor: '#4D4D4D',
    },
    tileTitle: {
        color: '#fff',
        backgroundColor: 'transparent',
        fontSize: 16,
        maxWidth: '100%',
        fontFamily: 'AvenirLTStd-Light',
    },
    tilePicto: {
        marginTop: 35,
        color: '#fff',
        fontSize: 35,
        width: '100%',
        textAlign: 'center',
    },
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        marginBottom: 12,
        paddingBottom: 12,
        fontSize: 24,
        fontWeight: '600',
        borderBottomWidth: 1,
        borderBottomColor: '#e1e1e1',
        color: '#333',
    },
    inputContainer: {
        marginTop: 12,
        marginBottom: 12,
    },
    footerContainer: {
        // position: 'absolute',
        // bottom: 0,
        // left: 0,
        marginTop: 5,
        backgroundColor: '#ffffff',
        borderTopWidth: 0,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        borderLeftWidth: 0,
        shadowColor: '#ffffff',
    },
    footerTabContainer: {
        backgroundColor: '#ffffff',
    },
    // sectionDescription: {
    //     marginTop: 8,
    //     fontSize: 18,
    //     fontWeight: '400',
    //     color: '#333',
    // },
    // highlight: {
    //     fontWeight: '700',
    // },
    // footer: {
    //     color: '#333',
    //     fontSize: 12,
    //     fontWeight: '600',
    //     padding: 4,
    //     paddingRight: 12,
    //     textAlign: 'right',
    // },
    agencyItem: {
    },
    agencyItemName: {
        fontSize: 18,
    },
    itemSeparator: {
        textAlign: 'center',
        width: '33%',
        height: 2,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 15,
        marginBottom: 15,
        paddingBottom: 2,
        borderTopWidth: 2,
        borderTopColor: '#034586',
        borderBottomWidth: 2,
        borderBottomColor: '#cc362c',
    },
});
