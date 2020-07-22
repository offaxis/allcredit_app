import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, Alert } from 'react-native';
import { Link } from 'react-router-native';


import styles from '../../../styles';
import PageTitle from '../../../components/Content/PageTitle';

export default function JobPage(props) {


    return (
        <View>
            <PageTitle />
            <Tiles />
        </View>
    );
}
