import React, { Fragment } from 'react';
import { Dimensions, View, Text } from 'react-native';
import { Link } from 'react-router-native';

import PageTitle from '../../../components/Content/PageTitle';
import Tiles from '../../../components/Content/Tiles';

export default function TestPage(props) {
    return (
        <Fragment>
            <View style={{
                    flex: 1,
                    height: Dimensions.get('window').height,
                }}
            >


                <Text> This is Main Container View. </Text>


                <View style={{
                        width: '100%',
                        height: 50,
                        backgroundColor: '#FF9800',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'absolute',
                        bottom: 0,
                    }}
                >

                    <Text style={{
                            color: '#fff',
                            fontSize: 22,
                        }}
                    >
                        This is Bottom View 2.
                    </Text>
                </View>

            </View>
        </Fragment>
    );
}
