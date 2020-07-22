import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-native';
import { View, TouchableHighlight } from 'react-native';
import { H3, Text, Icon } from 'native-base';
import * as Animatable from 'react-native-animatable';

import styles from '../../styles';

function Tiles(props) {
    const getTilesGroups = () => {
        const tiles = [];
        let tilesGroup = [];
        props.tiles.forEach((tile, index) => {
            tilesGroup.push({ ...tile, index });
            if(index === (props.tiles.length - 1) || index % 2 !== 0) {
                tiles.push(tilesGroup);
                tilesGroup = [];
            }
        });
        return tiles;
    };

    const renderTileTitle = tile => {
        return (
            <View style={[{ flexDirection: 'row', flexWrap: 'wrap' }, styles.center]}>
                <H3 style={[styles.center, { width: '100%', fontWeight: 'normal' }, { marginTop: tile.picto ? 0 : 20 }]}>
                    <Text style={[styles.specialFont, styles.tileTitle]}>{tile.title}</Text>
                </H3>
            </View>
        );
    };

    const renderTilePicto = tile => {
        return tile.picto && <Icon type="FontAwesome5" name={tile.picto} style={styles.tilePicto} />;
    };

    const renderTile = (tile, isAlt = false) => {
        const getCustomSlideAnimation = (type = 'left') => {
            return {
                from: {
                    [type]: -450,
                },
                to: {
                    [type]: 0,
                },
            };
        };
        return (
            <TouchableHighlight
                key={tile.title || tile.to || tile.picto}
                style={styles.tileWrapper}
                onPress={() => tile.to && props.history.push(tile.to)}
            >
                <Animatable.View
                    animation={getCustomSlideAnimation(tile.index === 0 || tile.index % 2 === 0 ? 'left' : 'right')}
                    duration={800}
                    delay={tile.index * 200}
                    easing="ease-in-out"
                    style={[
                        styles.tile,
                        isAlt && styles.tileAlt,
                        { height: tile.picto ? (props.tiles.length > 4 ? 160 : 190) : 80 },
                    ]}
                    useNativeDriver={false}
                >
                    {tile.picto && (
                        <Fragment>
                            <View style={{ flex: 1.5 }}>
                                {renderTilePicto(tile)}
                            </View>
                            <View style={{ flex: 0.5 }} />
                        </Fragment>
                    )}
                    <View style={{ flex: 1.5 }}>
                        {renderTileTitle(tile)}
                    </View>
                </Animatable.View>
            </TouchableHighlight>
        );
    };

    const renderTilesGroup = (tiles, altIndex = 1) => {
        return (
            <View
                style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'center',
                }}
            >
                {tiles.map((tile, index) => renderTile(tile, index === altIndex))}
            </View>
        );
    };

    return (
        <View style={styles.tilesWrapper}>
            {getTilesGroups().map((tilesGroup, index) => {
                return (
                    <View
                        key={index}
                        style={{
                            flex: 1,
                            flexDirection: 'column',
                        }}
                    >
                        {renderTilesGroup(tilesGroup, (index === 0 || index % 2 === 0) ? 1 : 0)}
                    </View>
                );
            })}
        </View>
    );
}

Tiles.defaultProps = {
    tiles: [],
    history: {},
};

Tiles.propTypes = {
    tiles: PropTypes.array,
    history: PropTypes.object,
};

export default withRouter(Tiles);
