import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Card, CardHeader, CardTitle, CardBody, Alert, Button } from 'reactstrap';
import FontAwesome from 'react-fontawesome';

import { getLoggedUser } from '../../modules/User/UserActions';
import { getInstitutionsForLoggedUser } from '../../modules/Institution/InstitutionActions';

import Loader from '../Loader/Loader';
import UserLoginPage from '../../modules/User/pages/UserLoginPage/UserLoginPage';
import ErrorPage from '../../modules/App/pages/error/ErrorPage';
import InstitutionErrorPage from '../../modules/Institution/pages/InstitutionErrorPage';

export default function authorization(allowedRoles) {
    return WrappedComponent => {
        class AuthorizationComponent extends Component {

            // componentWillMount() {
            //     if(!this.props.user) {
            //         this.context.router.push('/login');
            //     }
            // }
            //
            // componentWillUpdate(nextProps) {
            //     if(!nextProps.user) {
            //         this.context.router.push('/login');
            //     }
            // }

            isAuthenticated() {
                return this.props.user && allowedRoles.includes(this.props.user.role);
            }

            hasInstitutions() {
                return (this.props.user && this.props.user.institutions.includes('*')) || (this.props.institutions && this.props.institutions.length);
            }

            renderAlert() {
                if(this.props.user) {
                    return <ErrorPage />;
                }
                return <UserLoginPage location={this.props.location} redirect={this.props.location.pathname} />;
            }

            render() {
                // return <ComposedComponent {...this.props} />
                return (
                    <div>
                        {
                            this.props.isMounted
                            ?
                                this.isAuthenticated()
                                ?
                                    this.hasInstitutions()
                                    ? <WrappedComponent {...this.props} />
                                    : <InstitutionErrorPage />
                                : this.renderAlert()
                            : <Loader />
                        }
                    </div>
                );
            }
        }

        function mapStateToProps(store) {
            return {
                user: getLoggedUser(store),
                institutions: getInstitutionsForLoggedUser(store),
                isMounted: store.app.isMounted,
            };
        }

        AuthorizationComponent.propTypes = {
            dispatch: PropTypes.func.isRequired,
            location: PropTypes.object.isRequired,
            user: PropTypes.object,
            institutions: PropTypes.arrayOf(PropTypes.object),
            isMounted: PropTypes.bool.isRequired,
        };

        return connect(mapStateToProps)(withRouter(AuthorizationComponent));
    };
}
