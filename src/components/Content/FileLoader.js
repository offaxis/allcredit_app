import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';

import { getFileUrl } from '../../util/file';

import VisibilitySensor from 'react-visibility-sensor';

export default class FileLoad extends Component {

    constructor(props) {
        super(props);

        this.state = {
            url: null,
            isLoading: false,
            isLoaded: false,
            loadedUrls: {},
        };

        this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
        this.handleLoadFile = this.handleLoadFile.bind(this);
    }

    componentDidMount() {
        if(this.props.loadonmount) {
            this.handleLoadFile();
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.filename !== this.props.filename) {
            this.handleLoadFile();
        }
    }

    handleVisibilityChange(isVisible) {
        if(isVisible && !this.state.isLoaded && !this.state.isLoading) {
            this.handleLoadFile();
        }
    }

    handleLoadFile() {
        if(this.props.filename) {
            if(this.state.loadedUrls[this.props.filename]) {
                this.setState({
                    url: this.state.loadedUrls[this.props.filename],
                    isLoaded: true,
                });
            } else {
                this.setState({
                    isLoading: true,
                });
                getFileUrl(this.props.filename, this.props.owner).then(url => {
                    this.setState({
                        url,
                        isLoading: false,
                        isLoaded: true,
                        loadedUrls: {
                            ...this.state.loadedUrls,
                            [this.props.filename]: url,
                        },
                    });
                }).catch(() => {
                    console.error('File not found !');
                    this.setState({
                        isLoading: false,
                    });
                });
            }
        }
    }

    renderFileTag() {
        if(this.props.filename) {
            const ext = this.props.filename.split('.').pop();
            switch(ext) {
                case 'jpg':
                case 'jpeg':
                case 'gif':
                case 'png':
                case 'tiff':
                case 'bmp':
                case 'svg':
                    return <img src={this.state.url} {...this.props} />; // eslint-disable-line

                default:
                    return <a href={this.state.url} download={this.props.filename.split('/').pop()} target="_blank"><FontAwesome name="download" /> {this.props.filename.split('/').pop()}</a>; // eslint-disable-line
            }
        }
    }

    render() {
        if(this.props.filename) {
            return (
                <VisibilitySensor onChange={this.handleVisibilityChange}>
                    {
                        this.state.isLoaded
                        ? this.renderFileTag()
                        :
                            this.state.isLoading
                            ? <FontAwesome name="spinner" spin className="display-1 m-3" />
                            : <FontAwesome name="file-image" className="display-1 m-3" />
                    }
                </VisibilitySensor>
            );
        }
        return null;
    }
}

FileLoad.propTypes = {
    filename: PropTypes.string,
    owner: PropTypes.string,
    loadonmount: PropTypes.oneOf([PropTypes.bool, PropTypes.string]),
};
